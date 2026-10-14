using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text.Json;
using EasyAccomod.Api.Auth;
using EasyAccomod.Api.Data;
using EasyAccomod.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace EasyAccomod.Api.Tests;

// Cookies are handled by hand: the client does not keep them, so each test controls exactly
// which refresh cookie a request carries.
[Collection(ApiCollection.Name)]
public class RefreshTokenTests
{
    private const string CookieName = "refresh_token";
    private const string TestJwtKey = "test-signing-key-0123456789abcdef0123456789";

    private readonly ApiFactory _factory;

    public RefreshTokenTests(ApiFactory factory) => _factory = factory;

    private HttpClient NewClient() =>
        _factory.CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = false });

    private static async Task<HttpResponseMessage> LoginAsync(HttpClient client, string user = ApiClient.OwnerUser, string password = ApiClient.OwnerPassword)
    {
        var response = await client.PostAsJsonAsync("/api/Account/Token", new { UserName = user, Password = password });
        response.EnsureSuccessStatusCode();
        return response;
    }

    private static Task<HttpResponseMessage> PostWithCookieAsync(HttpClient client, string path, string cookieValue, string bearer = null)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, path);
        if (cookieValue != null)
            request.Headers.Add("Cookie", $"{CookieName}={cookieValue}");
        if (bearer != null)
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", bearer);
        return client.SendAsync(request);
    }

    private static Task<HttpResponseMessage> RefreshAsync(HttpClient client, string cookieValue) =>
        PostWithCookieAsync(client, "/api/Account/Refresh", cookieValue);

    // The Set-Cookie header of the refresh cookie, or null.
    private static string SetCookieHeader(HttpResponseMessage response) =>
        response.Headers.TryGetValues("Set-Cookie", out var values)
            ? values.FirstOrDefault(v => v.StartsWith(CookieName + "=", StringComparison.Ordinal))
            : null;

    private static string CookieValue(HttpResponseMessage response)
    {
        var header = SetCookieHeader(response);
        Assert.NotNull(header);
        return header.Split(';')[0][(CookieName.Length + 1)..];
    }

    private static async Task<string> AccessTokenAsync(HttpResponseMessage response)
    {
        using var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        return json.RootElement.GetProperty("access_token").GetString();
    }

    private static void AssertCookieDeleted(HttpResponseMessage response)
    {
        var header = SetCookieHeader(response);
        Assert.NotNull(header);
        Assert.Equal(string.Empty, header.Split(';')[0][(CookieName.Length + 1)..]);
        Assert.Contains("expires=Thu, 01 Jan 1970", header, StringComparison.OrdinalIgnoreCase);
    }

    private async Task<HttpStatusCode> InfoStatusAsync(HttpClient client, string accessToken)
    {
        var request = new HttpRequestMessage(HttpMethod.Get, "/api/Account/Info");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        return (await client.SendAsync(request)).StatusCode;
    }

    [Fact]
    public async Task Login_sets_an_http_only_refresh_cookie_scoped_to_the_account_endpoints()
    {
        using var client = NewClient();

        var response = await LoginAsync(client);

        var header = SetCookieHeader(response);
        Assert.NotNull(header);
        Assert.False(string.IsNullOrEmpty(CookieValue(response)));
        Assert.Contains("httponly", header, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("path=/api/Account", header, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("samesite=strict", header, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("expires=", header, StringComparison.OrdinalIgnoreCase);
        // Development runs over plain http, where the Secure default is off.
        Assert.DoesNotContain("secure", header.Replace("samesite", ""), StringComparison.OrdinalIgnoreCase);

        // The response body keeps its shape and never carries the refresh token.
        var body = await response.Content.ReadAsStringAsync();
        using var json = JsonDocument.Parse(body);
        foreach (var key in new[] { "access_token", "token_type", "expires_in", "username", "name", "account_id", "user_id", "role" })
            Assert.True(json.RootElement.TryGetProperty(key, out _), key);
        Assert.DoesNotContain(CookieValue(response), body);
    }

    [Fact]
    public async Task The_database_keeps_only_the_hash_of_the_refresh_token()
    {
        using var client = NewClient();
        var raw = CookieValue(await LoginAsync(client));

        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        Assert.False(await context.RefreshTokens.AnyAsync(t => t.TokenHash == raw));
        var row = await context.RefreshTokens.SingleAsync(t => t.TokenHash == RefreshTokenService.Hash(raw));
        Assert.Equal(64, row.TokenHash.Length);
        Assert.Null(row.RevokedAt);
        Assert.True(row.ExpiresAt > DateTime.UtcNow.AddDays(29));
    }

    [Fact]
    public async Task Refresh_returns_a_working_access_token_and_a_different_cookie()
    {
        using var client = NewClient();
        var login = await LoginAsync(client);
        var first = CookieValue(login);

        var refreshed = await RefreshAsync(client, first);

        Assert.Equal(HttpStatusCode.OK, refreshed.StatusCode);
        var second = CookieValue(refreshed);
        Assert.NotEqual(first, second);
        var header = SetCookieHeader(refreshed);
        Assert.Contains("httponly", header, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("path=/api/Account", header, StringComparison.OrdinalIgnoreCase);

        using var original = JsonDocument.Parse(await login.Content.ReadAsStringAsync());
        using var renewed = JsonDocument.Parse(await refreshed.Content.ReadAsStringAsync());
        foreach (var key in new[] { "token_type", "expires_in", "username", "name", "account_id", "user_id", "role" })
            Assert.Equal(original.RootElement.GetProperty(key).ToString(), renewed.RootElement.GetProperty(key).ToString());
        Assert.Equal(HttpStatusCode.OK, await InfoStatusAsync(client, renewed.RootElement.GetProperty("access_token").GetString()));
    }

    [Fact]
    public async Task Reusing_a_rotated_cookie_after_the_grace_revokes_the_whole_session()
    {
        using var client = NewClient();
        var first = CookieValue(await LoginAsync(client));
        var rotated = await RefreshAsync(client, first);
        var second = CookieValue(rotated);

        _factory.Clock.Advance(TimeSpan.FromSeconds(11));
        var replay = await RefreshAsync(client, first);

        Assert.Equal(HttpStatusCode.Unauthorized, replay.StatusCode);
        AssertCookieDeleted(replay);
        Assert.Equal(HttpStatusCode.Unauthorized, (await RefreshAsync(client, second)).StatusCode);
    }

    [Fact]
    public async Task Reusing_a_rotated_cookie_inside_the_grace_issues_another_token_and_keeps_the_session()
    {
        using var client = NewClient();
        var first = CookieValue(await LoginAsync(client));
        var second = CookieValue(await RefreshAsync(client, first));

        // A second tab that presents the cookie it had before the first tab's rotation landed.
        var raced = await RefreshAsync(client, first);

        Assert.Equal(HttpStatusCode.OK, raced.StatusCode);
        var third = CookieValue(raced);
        Assert.NotEqual(second, third);
        Assert.Equal(HttpStatusCode.OK, await InfoStatusAsync(client, await AccessTokenAsync(raced)));

        // Both replacements stay valid.
        Assert.Equal(HttpStatusCode.OK, (await RefreshAsync(client, second)).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await RefreshAsync(client, third)).StatusCode);
    }

    [Fact]
    public async Task The_grace_does_not_apply_once_the_session_was_logged_out()
    {
        using var client = NewClient();
        var first = CookieValue(await LoginAsync(client));
        var second = CookieValue(await RefreshAsync(client, first));

        Assert.Equal(HttpStatusCode.OK, (await PostWithCookieAsync(client, "/api/Account/Logout", second)).StatusCode);

        Assert.Equal(HttpStatusCode.Unauthorized, (await RefreshAsync(client, first)).StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, (await RefreshAsync(client, second)).StatusCode);
    }

    [Fact]
    public async Task Refresh_without_a_cookie_or_with_a_garbage_cookie_is_unauthorized()
    {
        using var client = NewClient();

        var none = await RefreshAsync(client, null);
        var garbage = await RefreshAsync(client, "not-a-real-token");

        Assert.Equal(HttpStatusCode.Unauthorized, none.StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, garbage.StatusCode);
        AssertCookieDeleted(garbage);
    }

    [Fact]
    public async Task Logout_ends_the_session_without_an_access_token()
    {
        using var client = NewClient();
        var cookie = CookieValue(await LoginAsync(client));

        var logout = await PostWithCookieAsync(client, "/api/Account/Logout", cookie);

        Assert.Equal(HttpStatusCode.OK, logout.StatusCode);
        AssertCookieDeleted(logout);
        Assert.Equal(HttpStatusCode.Unauthorized, (await RefreshAsync(client, cookie)).StatusCode);
    }

    [Fact]
    public async Task Logout_works_with_an_expired_access_token_and_still_revokes()
    {
        using var client = NewClient();
        var cookie = CookieValue(await LoginAsync(client));
        var expired = new JwtSecurityTokenHandler().WriteToken(new JwtSecurityToken(
            issuer: "EasyAccomod",
            audience: "EasyAccomod",
            claims: [new Claim(ClaimTypes.NameIdentifier, "someone"), new Claim(ClaimTypes.Name, "Owner1")],
            notBefore: DateTime.UtcNow.AddHours(-2),
            expires: DateTime.UtcNow.AddHours(-1),
            signingCredentials: new SigningCredentials(JwtTokenService.CreateKey(TestJwtKey), SecurityAlgorithms.HmacSha256)));
        Assert.Equal(HttpStatusCode.Unauthorized, await InfoStatusAsync(client, expired));

        var logout = await PostWithCookieAsync(client, "/api/Account/Logout", cookie, expired);

        Assert.Equal(HttpStatusCode.OK, logout.StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, (await RefreshAsync(client, cookie)).StatusCode);
    }

    [Fact]
    public async Task Logout_without_any_cookie_or_token_still_succeeds()
    {
        using var client = NewClient();

        var logout = await PostWithCookieAsync(client, "/api/Account/Logout", null);

        Assert.Equal(HttpStatusCode.OK, logout.StatusCode);
    }

    [Fact]
    public async Task An_expired_refresh_token_is_unauthorized()
    {
        using var client = NewClient();
        var cookie = CookieValue(await LoginAsync(client));

        _factory.Clock.Advance(TimeSpan.FromDays(31));

        Assert.Equal(HttpStatusCode.Unauthorized, (await RefreshAsync(client, cookie)).StatusCode);
    }

    [Fact]
    public async Task A_locked_out_user_cannot_refresh_but_keeps_the_session_for_after_the_lockout()
    {
        using var client = NewClient();
        var userName = "refresh" + Guid.NewGuid().ToString("N")[..10];
        var registered = await client.PostAsJsonAsync("/api/Account/RenterRegister", new
        {
            Name = "Refresh Tester",
            UserName = userName,
            Email = userName + "@test.com",
            Password = "Abcdef1!",
            ConfirmPassword = "Abcdef1!",
        });
        registered.EnsureSuccessStatusCode();
        var cookie = CookieValue(await LoginAsync(client, userName, "Abcdef1!"));

        using (var scope = _factory.Services.CreateScope())
        {
            var users = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var user = await users.FindByNameAsync(userName);
            await users.SetLockoutEndDateAsync(user, DateTimeOffset.UtcNow.AddMinutes(5));
        }

        // Locked, not logged out: the cookie is not cleared and the token is not revoked.
        var locked = await RefreshAsync(client, cookie);
        Assert.Equal(HttpStatusCode.Locked, locked.StatusCode);
        Assert.Null(SetCookieHeader(locked));

        using (var scope = _factory.Services.CreateScope())
        {
            var users = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var user = await users.FindByNameAsync(userName);
            await users.SetLockoutEndDateAsync(user, null);
        }

        Assert.Equal(HttpStatusCode.OK, (await RefreshAsync(client, cookie)).StatusCode);
    }

    [Fact]
    public async Task The_access_token_lives_for_the_configured_minutes()
    {
        using var client = NewClient();
        var login = await LoginAsync(client);
        var refreshed = await RefreshAsync(client, CookieValue(login));

        foreach (var response in new[] { login, refreshed })
        {
            using var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
            Assert.Equal(15 * 60, json.RootElement.GetProperty("expires_in").GetInt32());

            var token = new JwtSecurityTokenHandler().ReadJwtToken(json.RootElement.GetProperty("access_token").GetString());
            var lifetime = token.ValidTo - DateTime.UtcNow;
            Assert.InRange(lifetime, TimeSpan.FromMinutes(14), TimeSpan.FromMinutes(15));
        }
    }

    [Fact]
    public async Task Cors_allows_credentials_only_for_the_configured_origin()
    {
        using var client = NewClient();

        var allowed = new HttpRequestMessage(HttpMethod.Post, "/api/Account/Refresh");
        allowed.Headers.Add("Origin", "http://localhost:3000");
        var allowedResponse = await client.SendAsync(allowed);
        Assert.Equal("http://localhost:3000", allowedResponse.Headers.GetValues("Access-Control-Allow-Origin").Single());
        Assert.Equal("true", allowedResponse.Headers.GetValues("Access-Control-Allow-Credentials").Single());

        var foreign = new HttpRequestMessage(HttpMethod.Post, "/api/Account/Refresh");
        foreign.Headers.Add("Origin", "http://evil.example");
        var foreignResponse = await client.SendAsync(foreign);
        Assert.False(foreignResponse.Headers.Contains("Access-Control-Allow-Origin"));
        Assert.False(foreignResponse.Headers.Contains("Access-Control-Allow-Credentials"));
    }
}
