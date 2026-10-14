using System.Net;
using System.Net.Http.Json;

namespace EasyAccomod.Api.Tests;

[Collection(ApiCollection.Name)]
public class LoginTests
{
    private readonly ApiFactory _factory;

    public LoginTests(ApiFactory factory) => _factory = factory;

    [Fact]
    public async Task A_correct_password_returns_a_token_for_the_account()
    {
        using var client = _factory.CreateClient();

        var login = await ApiClient.LoginAsync(client, ApiClient.AdminUser, ApiClient.AdminPassword);

        Assert.False(string.IsNullOrEmpty(login.Token));
        Assert.False(string.IsNullOrEmpty(login.AccountId));
    }

    [Fact]
    public async Task A_wrong_password_and_an_unknown_user_get_the_same_reply()
    {
        using var client = _factory.CreateClient();

        var wrongPassword = await client.PostAsJsonAsync("/api/Account/Token", new { UserName = "Renter1", Password = "Wrong1234." });
        var unknownUser = await client.PostAsJsonAsync("/api/Account/Token", new { UserName = "NoSuchUser", Password = "Wrong1234." });

        Assert.Equal(HttpStatusCode.BadRequest, wrongPassword.StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, unknownUser.StatusCode);
        Assert.Equal(await unknownUser.Content.ReadAsStringAsync(), await wrongPassword.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task Five_wrong_passwords_lock_the_account_even_for_the_right_password()
    {
        using var client = _factory.CreateClient();
        var userName = "Lock" + Guid.NewGuid().ToString("N")[..10];
        var register = await client.PostAsJsonAsync("/api/Account/RenterRegister", new
        {
            Name = "Lock Test",
            UserName = userName,
            Email = userName.ToLowerInvariant() + "@example.com",
            Password = "Locked1234.",
            ConfirmPassword = "Locked1234.",
        });
        Assert.Equal(HttpStatusCode.OK, register.StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await client.PostAsJsonAsync("/api/Account/Token", new { UserName = userName, Password = "Locked1234." })).StatusCode);

        for (var i = 0; i < 5; i++)
        {
            var failed = await client.PostAsJsonAsync("/api/Account/Token", new { UserName = userName, Password = "Wrong1234." });
            Assert.Equal(HttpStatusCode.BadRequest, failed.StatusCode);
        }

        var locked = await client.PostAsJsonAsync("/api/Account/Token", new { UserName = userName, Password = "Locked1234." });
        var wrong = await client.PostAsJsonAsync("/api/Account/Token", new { UserName = userName, Password = "Wrong1234." });

        Assert.Equal(HttpStatusCode.BadRequest, locked.StatusCode);
        Assert.Equal(await wrong.Content.ReadAsStringAsync(), await locked.Content.ReadAsStringAsync());
    }
}
