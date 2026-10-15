using System.Net;
using System.Text.Json;

namespace EasyAccomod.Api.Tests;

[Collection(ApiCollection.Name)]
public class PagingTests
{
    private readonly ApiFactory _factory;

    public PagingTests(ApiFactory factory) => _factory = factory;

    [Theory]
    [InlineData("/api/RentalPosts/Search?_page=0")]
    [InlineData("/api/RentalPosts/Search?_page=-3")]
    [InlineData("/api/RentalPosts/Search?_limit=0")]
    [InlineData("/api/RentalPosts/Search?_limit=-1")]
    [InlineData("/api/RentalPosts/Search?_limit=101")]
    [InlineData("/api/RentalPosts/Search?_limit=100000")]
    [InlineData("/api/RentalPosts/Search?_page=2147483647&_limit=100")]
    [InlineData("/api/RentalPosts/1/Comments?_limit=101")]
    [InlineData("/api/RentalPosts/1/Comments?_page=0")]
    public async Task Public_list_endpoints_reject_unusable_paging(string url)
    {
        using var client = await ApiClient.ClientForAsync(_factory);

        var response = await client.GetAsync(url);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Theory]
    [InlineData("Admin", "Admin1234.", "/api/Admin/Owners?_limit=101")]
    [InlineData("Admin", "Admin1234.", "/api/Admin/Owners?_page=0")]
    [InlineData("Admin", "Admin1234.", "/api/Admin/RentalPosts?_limit=0")]
    [InlineData("Admin", "Admin1234.", "/api/Admin/RentalPosts/ExtendPeriod?_limit=1000")]
    [InlineData("Admin", "Admin1234.", "/api/Admin/PendingComment?_limit=101")]
    [InlineData("Admin", "Admin1234.", "/api/Admin/RentalPost/Reports?_page=0")]
    [InlineData("Owner1", "Owner1234.", "/api/Owner/RentalPosts?_limit=999")]
    [InlineData("Owner1", "Owner1234.", "/api/Owner/RentalPosts?_page=0")]
    [InlineData("Renter1", "Renter1234.", "/api/Renter/RentalPost/Likes?_limit=101")]
    [InlineData("Renter1", "Renter1234.", "/api/Renter/RentalPost/Likes?_page=0")]
    public async Task Protected_list_endpoints_reject_unusable_paging(string user, string password, string url)
    {
        using var client = await ApiClient.ClientForAsync(_factory, user, password);

        var response = await client.GetAsync(url);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Theory]
    [InlineData("Admin", "Admin1234.", "/api/Admin/Owners?_page=1&_limit=100")]
    [InlineData("Admin", "Admin1234.", "/api/Admin/RentalPosts?_page=1&_limit=1")]
    [InlineData("Admin", "Admin1234.", "/api/Admin/RentalPosts?_page=1&_limit=100")]
    [InlineData("Admin", "Admin1234.", "/api/Admin/RentalPosts/ExtendPeriod?_page=1&_limit=100")]
    [InlineData("Admin", "Admin1234.", "/api/Admin/RentalPosts/ExtendPeriod")]
    [InlineData("Admin", "Admin1234.", "/api/Admin/PendingComment")]
    [InlineData("Admin", "Admin1234.", "/api/Admin/PendingComment?_page=1&_limit=100")]
    [InlineData("Admin", "Admin1234.", "/api/Admin/RentalPost/Reports")]
    [InlineData("Admin", "Admin1234.", "/api/Admin/RentalPost/Reports?_page=1&_limit=100&isSolved=true")]
    [InlineData("Owner1", "Owner1234.", "/api/Owner/RentalPosts?_page=1&_limit=15")]
    [InlineData("Renter1", "Renter1234.", "/api/Renter/RentalPost/Likes?_page=1&_limit=15")]
    public async Task Protected_list_endpoints_accept_valid_paging(string user, string password, string url)
    {
        using var client = await ApiClient.ClientForAsync(_factory, user, password);

        var response = await client.GetAsync(url);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Search_accepts_the_largest_page_size_and_rejects_one_more()
    {
        using var client = await ApiClient.ClientForAsync(_factory);

        var largest = await client.GetAsync("/api/RentalPosts/Search?_page=1&_limit=100");
        var tooLarge = await client.GetAsync("/api/RentalPosts/Search?_page=1&_limit=101");

        Assert.Equal(HttpStatusCode.OK, largest.StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, tooLarge.StatusCode);
    }

    [Fact]
    public async Task Search_with_no_matches_is_an_empty_first_page()
    {
        using var client = await ApiClient.ClientForAsync(_factory);

        var response = await client.GetAsync("/api/RentalPosts/Search?_page=1&_limit=100&street=" + Guid.NewGuid().ToString("N"));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        Assert.Equal(0, json.RootElement.GetProperty("simplePostDtos").GetArrayLength());
        Assert.Equal(0, json.RootElement.GetProperty("maxPage").GetInt32());
    }

    [Fact]
    public async Task Search_past_the_last_page_is_not_found()
    {
        using var client = await ApiClient.ClientForAsync(_factory);

        var response = await client.GetAsync("/api/RentalPosts/Search?_page=999&_limit=50");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
