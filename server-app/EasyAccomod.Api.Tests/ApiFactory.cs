using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Npgsql;

namespace EasyAccomod.Api.Tests;

// Hosts the real API against a PostgreSQL database that exists only for this test run.
// The server is taken from ConnectionStrings__DefaultConnection (as in CI) and falls back to
// the docker-compose database; only the database name is replaced.
public sealed class ApiFactory : WebApplicationFactory<Program>
{
    private const string DefaultServer =
        "Host=localhost;Port=5433;Database=easyaccomod;Username=easyaccomod;Password=easyaccomod";

    // The API's clock; tests move it forward to expire or age refresh tokens.
    public TestClock Clock { get; } = new();

    private readonly NpgsqlConnectionStringBuilder _server;
    private readonly string _databaseName = "easyaccomod_test_" + Guid.NewGuid().ToString("N");

    public ApiFactory()
    {
        var configured = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");
        _server = new NpgsqlConnectionStringBuilder(string.IsNullOrWhiteSpace(configured) ? DefaultServer : configured);

        // Program reads its configuration while it builds the host, so the settings go in as
        // environment variables (which beat appsettings) rather than through the web host builder.
        var testDatabase = new NpgsqlConnectionStringBuilder(_server.ConnectionString) { Database = _databaseName };
        Environment.SetEnvironmentVariable("ConnectionStrings__DefaultConnection", testDatabase.ConnectionString);
        Environment.SetEnvironmentVariable("Jwt__Key", "test-signing-key-0123456789abcdef0123456789");
        Environment.SetEnvironmentVariable("RateLimiting__LoginPermitLimit", "1000");
        Environment.SetEnvironmentVariable("RateLimiting__RefreshPermitLimit", "1000");
        Environment.SetEnvironmentVariable("Views__DedupeWindowMinutes", "60");
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        // Development seeds the roles, the addresses and the demo accounts on startup.
        builder.UseEnvironment("Development");
        builder.ConfigureTestServices(services =>
        {
            services.RemoveAll<TimeProvider>();
            services.AddSingleton<TimeProvider>(Clock);
        });
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        if (!disposing)
            return;

        var maintenance = new NpgsqlConnectionStringBuilder(_server.ConnectionString) { Database = "postgres" };
        using var connection = new NpgsqlConnection(maintenance.ConnectionString);
        connection.Open();
        using var command = connection.CreateCommand();
        command.CommandText = $"DROP DATABASE IF EXISTS \"{_databaseName}\" WITH (FORCE)";
        command.ExecuteNonQuery();
    }
}

// Real time plus an offset that only moves forward.
public sealed class TestClock : TimeProvider
{
    private long _offsetTicks;

    public void Advance(TimeSpan by) => Interlocked.Add(ref _offsetTicks, by.Ticks);

    public override DateTimeOffset GetUtcNow() => DateTimeOffset.UtcNow.AddTicks(Interlocked.Read(ref _offsetTicks));
}

[CollectionDefinition(Name)]
public class ApiCollection : ICollectionFixture<ApiFactory>
{
    public const string Name = "api";
}
