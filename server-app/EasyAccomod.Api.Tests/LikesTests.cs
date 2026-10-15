using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace EasyAccomod.Api.Tests;

[Collection(ApiCollection.Name)]
public class LikesTests
{
    private const string LikesUrl = "/api/Renter/RentalPost/Likes";

    private readonly ApiFactory _factory;

    public LikesTests(ApiFactory factory) => _factory = factory;

    // Liking a post that is already liked removes the like, so the same call likes and unlikes.
    private static async Task ToggleLikeAsync(HttpClient renter, int postId)
    {
        var response = await renter.PostAsJsonAsync("/api/Renter/RentalPost/Like", new { AccommodationRentalPostId = postId });
        response.EnsureSuccessStatusCode();
    }

    [Fact]
    public async Task A_renter_with_no_liked_posts_gets_an_empty_first_page()
    {
        var postId = await ApiClient.CreateApprovedPostAsync(_factory);
        using var renter = await ApiClient.ClientForAsync(_factory, ApiClient.RenterUser, ApiClient.RenterPassword);
        await ToggleLikeAsync(renter, postId);
        await ToggleLikeAsync(renter, postId);

        var response = await renter.GetAsync(LikesUrl + "?_page=1&_limit=15");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal(0, result.GetProperty("simplePostDtos").GetArrayLength());
        Assert.Equal(0, result.GetProperty("maxPage").GetInt32());
    }

    [Fact]
    public async Task A_page_past_the_last_one_is_not_found()
    {
        var postId = await ApiClient.CreateApprovedPostAsync(_factory);
        using var renter = await ApiClient.ClientForAsync(_factory, ApiClient.RenterUser, ApiClient.RenterPassword);
        await ToggleLikeAsync(renter, postId);
        try
        {
            var first = await renter.GetAsync(LikesUrl + "?_page=1&_limit=15");
            var past = await renter.GetAsync(LikesUrl + "?_page=2&_limit=15");

            Assert.Equal(HttpStatusCode.OK, first.StatusCode);
            Assert.Equal(HttpStatusCode.NotFound, past.StatusCode);
        }
        finally
        {
            await ToggleLikeAsync(renter, postId);
        }
    }
}
