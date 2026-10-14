using System.Net;
using System.Security.Claims;
using System.Text.Json.Serialization;
using EasyAccomod.Api.Auth;
using EasyAccomod.Api.Data;
using EasyAccomod.Api.Health;
using EasyAccomod.Api.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

var jwtOptions = builder.Configuration.GetSection("Jwt").Get<JwtOptions>() ?? new JwtOptions();
if (string.IsNullOrWhiteSpace(jwtOptions.Key) || jwtOptions.Key.Length < 32)
{
    throw new InvalidOperationException(
        "Jwt:Key must be configured with at least 32 characters (set the Jwt__Key environment variable).");
}

builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));
builder.Services.AddSingleton<JwtTokenService>();
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddSingleton(RefreshTokenSettings.Load(builder.Configuration, builder.Environment.IsDevelopment()));
builder.Services.AddScoped<RefreshTokenService>();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services
    .AddIdentityCore<ApplicationUser>(options =>
    {
        options.User.RequireUniqueEmail = true;
        options.User.AllowedUserNameCharacters = string.Empty;
        options.Password.RequiredLength = 6;
        options.Password.RequireNonAlphanumeric = true;
        options.Password.RequireDigit = true;
        options.Password.RequireLowercase = true;
        options.Password.RequireUppercase = true;
        options.Lockout.AllowedForNewUsers = true;
        options.Lockout.MaxFailedAccessAttempts = 5;
        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    })
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtOptions.Issuer,
            ValidateAudience = true,
            ValidAudience = jwtOptions.Audience,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = JwtTokenService.CreateKey(jwtOptions.Key),
            ValidateLifetime = true,
            NameClaimType = ClaimTypes.Name,
            RoleClaimType = ClaimTypes.Role,
        };
        options.Events = new JwtBearerEvents
        {
            // A token outlives role changes (owner info edits, approvals) and account removal,
            // so trust the database for the user's current roles instead of the token's claims.
            OnTokenValidated = async context =>
            {
                var userManager = context.HttpContext.RequestServices.GetRequiredService<UserManager<ApplicationUser>>();
                var userId = context.Principal?.FindFirstValue(ClaimTypes.NameIdentifier);
                var user = userId == null ? null : await userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    context.Fail("The account no longer exists.");
                    return;
                }

                var identity = (ClaimsIdentity)context.Principal.Identity;
                foreach (var claim in identity.FindAll(ClaimTypes.Role).ToList())
                    identity.RemoveClaim(claim);
                foreach (var role in await userManager.GetRolesAsync(user))
                    identity.AddClaim(new Claim(ClaimTypes.Role, role));
            },
        };
    });
builder.Services.AddAuthorization();

var corsOrigins = builder.Configuration.GetSection("Cors:Origins").Get<string[]>() ?? Array.Empty<string>();
if (corsOrigins.Contains("*"))
{
    throw new InvalidOperationException(
        "Cors:Origins must list exact origins; '*' cannot be combined with the credentials the refresh cookie needs.");
}

builder.Services.AddCors(options => options.AddDefaultPolicy(policy =>
{
    policy.WithOrigins(corsOrigins).AllowAnyHeader().AllowAnyMethod();
    // The refresh cookie is sent cross-origin only to the exact origins listed above. With no
    // origins configured nothing is allowed, so credentials are not enabled either.
    if (corsOrigins.Length > 0)
        policy.AllowCredentials();
}));

builder.Services.AddScoped<DbSeeder>();

// Behind a reverse proxy the client address arrives in X-Forwarded-For. It is only trusted from
// the proxies listed in ForwardedHeaders:KnownProxies / KnownNetworks (a CIDR such as 10.0.0.0/8),
// and only the entry the nearest proxy added is used, so a client cannot spoof its own address.
// With nothing configured the headers are ignored and the connection's address is used.
var knownProxies = builder.Configuration.GetSection("ForwardedHeaders:KnownProxies").Get<string[]>() ?? Array.Empty<string>();
var knownNetworks = builder.Configuration.GetSection("ForwardedHeaders:KnownNetworks").Get<string[]>() ?? Array.Empty<string>();
var useForwardedHeaders = knownProxies.Length + knownNetworks.Length > 0;
if (useForwardedHeaders)
{
    builder.Services.Configure<ForwardedHeadersOptions>(options =>
    {
        options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
        options.ForwardLimit = 1;
        options.KnownProxies.Clear();
        options.KnownIPNetworks.Clear();
        foreach (var proxy in knownProxies)
            options.KnownProxies.Add(IPAddress.Parse(proxy));
        foreach (var network in knownNetworks)
            options.KnownIPNetworks.Add(System.Net.IPNetwork.Parse(network));
    });
}

// Per-address limit on logins: the per-account lockout alone does not stop guessing across many
// accounts or parallel guesses against one. Clients behind one NAT or proxy address share the budget.
var loginPermitLimit = builder.Configuration.GetValue("RateLimiting:LoginPermitLimit", 10);
var loginWindowSeconds = builder.Configuration.GetValue("RateLimiting:LoginWindowSeconds", 60);
// Refreshing is cheaper than a login and happens in the background, so its limit is more generous.
var refreshPermitLimit = builder.Configuration.GetValue("RateLimiting:RefreshPermitLimit", 30);
var refreshWindowSeconds = builder.Configuration.GetValue("RateLimiting:RefreshWindowSeconds", 60);
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.OnRejected = (context, _) =>
    {
        var retryAfterSeconds = context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter)
            ? (int)Math.Ceiling(retryAfter.TotalSeconds)
            : loginWindowSeconds;
        context.HttpContext.Response.Headers.RetryAfter = retryAfterSeconds.ToString();
        return ValueTask.CompletedTask;
    };
    options.AddPolicy("login", httpContext => RateLimitPartition.GetFixedWindowLimiter(
        ClientAddress.PartitionKey(httpContext.Connection.RemoteIpAddress),
        _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = loginPermitLimit,
            Window = TimeSpan.FromSeconds(loginWindowSeconds),
            QueueLimit = 0,
        }));
    options.AddPolicy("refresh", httpContext => RateLimitPartition.GetFixedWindowLimiter(
        ClientAddress.PartitionKey(httpContext.Connection.RemoteIpAddress),
        _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = refreshPermitLimit,
            Window = TimeSpan.FromSeconds(refreshWindowSeconds),
            QueueLimit = 0,
        }));
});

builder.Services.AddHealthChecks().AddCheck<DatabaseHealthCheck>("database");

builder.Services.AddControllers().AddJsonOptions(options =>
{
    // The old Newtonsoft setup accepted numbers sent as strings (e.g. from form inputs).
    options.JsonSerializerOptions.NumberHandling = JsonNumberHandling.AllowReadingFromString;
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    await scope.ServiceProvider.GetRequiredService<DbSeeder>().SeedAsync(app.Environment.IsDevelopment());
}

if (useForwardedHeaders)
    app.UseForwardedHeaders();

if (!app.Environment.IsDevelopment())
{
    // TLS is expected to end at a reverse proxy that sets X-Forwarded-Proto (see above);
    // browsers only honor HSTS over HTTPS.
    app.UseHsts();
}

app.UseCors();
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");

app.Run();

// Lets the integration tests host the app through WebApplicationFactory<Program>.
public partial class Program { }
