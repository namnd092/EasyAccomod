using System.Net;
using System.Net.Http.Json;

namespace EasyAccomod.Api.Tests;

[Collection(ApiCollection.Name)]
public class AuthorizationTests
{
    private readonly ApiFactory _factory;

    public AuthorizationTests(ApiFactory factory) => _factory = factory;

    // user null = anonymous visitor
    [Theory]
    [InlineData(null, null, "/api/Admin/Owners", HttpStatusCode.Unauthorized)]
    [InlineData("Renter1", "Renter1234.", "/api/Admin/Owners", HttpStatusCode.Forbidden)]
    [InlineData("Owner1", "Owner1234.", "/api/Admin/Owners", HttpStatusCode.Forbidden)]
    [InlineData("Admin", "Admin1234.", "/api/Admin/Owners", HttpStatusCode.OK)]
    [InlineData(null, null, "/api/Owner/RentalPosts", HttpStatusCode.Unauthorized)]
    [InlineData("Renter1", "Renter1234.", "/api/Owner/RentalPosts", HttpStatusCode.Forbidden)]
    [InlineData("Admin", "Admin1234.", "/api/Owner/RentalPosts", HttpStatusCode.Forbidden)]
    [InlineData("Owner1", "Owner1234.", "/api/Owner/RentalPosts", HttpStatusCode.OK)]
    [InlineData("Owner2", "Owner1234.", "/api/Owner/RentalPosts", HttpStatusCode.Forbidden)] // waiting for Admin to confirm
    [InlineData(null, null, "/api/Renter/RentalPost/Likes", HttpStatusCode.Unauthorized)]
    [InlineData("Admin", "Admin1234.", "/api/Renter/RentalPost/Likes", HttpStatusCode.Forbidden)]
    [InlineData("Owner1", "Owner1234.", "/api/Renter/RentalPost/Likes", HttpStatusCode.Forbidden)]
    [InlineData(null, null, "/api/Account/Info", HttpStatusCode.Unauthorized)]
    [InlineData("Renter1", "Renter1234.", "/api/Account/Info", HttpStatusCode.OK)]
    [InlineData(null, null, "/api/RentalPosts/Statuses", HttpStatusCode.OK)]
    public async Task Endpoints_enforce_the_caller_role(string user, string password, string url, HttpStatusCode expected)
    {
        using var client = await ApiClient.ClientForAsync(_factory, user, password);

        var response = await client.GetAsync(url);

        Assert.Equal(expected, response.StatusCode);
    }

    [Fact]
    public async Task A_renter_cannot_create_a_post()
    {
        using var renter = await ApiClient.ClientForAsync(_factory, ApiClient.RenterUser, ApiClient.RenterPassword);

        var response = await renter.PostAsJsonAsync("/api/RentalPosts", new { });

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task A_tampered_token_is_rejected()
    {
        using var client = await ApiClient.ClientForAsync(_factory);
        var login = await ApiClient.LoginAsync(client, ApiClient.AdminUser, ApiClient.AdminPassword);
        client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", login.Token[..^3] + "abc");

        var response = await client.GetAsync("/api/Admin/Owners");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}
