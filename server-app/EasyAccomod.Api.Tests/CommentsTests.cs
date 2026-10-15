using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace EasyAccomod.Api.Tests;

[Collection(ApiCollection.Name)]
public class CommentsTests
{
    private readonly ApiFactory _factory;

    public CommentsTests(ApiFactory factory) => _factory = factory;

    [Fact]
    public async Task A_post_without_comments_has_an_empty_first_page()
    {
        var postId = await ApiClient.CreateApprovedPostAsync(_factory);
        using var visitor = await ApiClient.ClientForAsync(_factory);

        var response = await visitor.GetAsync($"/api/RentalPosts/{postId}/Comments?_page=1&_limit=10");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal(0, result.GetProperty("listCommentDtos").GetArrayLength());
        Assert.Equal(0, result.GetProperty("maxPage").GetInt32());
    }

    [Fact]
    public async Task A_comment_waiting_for_approval_does_not_count()
    {
        var postId = await ApiClient.CreateApprovedPostAsync(_factory);
        using var renter = await ApiClient.ClientForAsync(_factory, ApiClient.RenterUser, ApiClient.RenterPassword);
        var commented = await renter.PostAsJsonAsync(
            "/api/Renter/RentalPost/Comment",
            new { AccommodationRentalPostId = postId, Rate = 4, Content = "Chưa duyệt " + Guid.NewGuid().ToString("N") });
        commented.EnsureSuccessStatusCode();
        using var visitor = await ApiClient.ClientForAsync(_factory);

        var response = await visitor.GetAsync($"/api/RentalPosts/{postId}/Comments");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal(0, result.GetProperty("listCommentDtos").GetArrayLength());
    }

    [Fact]
    public async Task A_page_past_the_last_one_is_not_found()
    {
        var postId = await ApiClient.CreateApprovedPostAsync(_factory);
        var content = "Đã duyệt " + Guid.NewGuid().ToString("N");
        using var renter = await ApiClient.ClientForAsync(_factory, ApiClient.RenterUser, ApiClient.RenterPassword);
        (await renter.PostAsJsonAsync(
            "/api/Renter/RentalPost/Comment",
            new { AccommodationRentalPostId = postId, Rate = 5, Content = content })).EnsureSuccessStatusCode();

        using var admin = await ApiClient.ClientForAsync(_factory, ApiClient.AdminUser, ApiClient.AdminPassword);
        var pending = await admin.GetFromJsonAsync<JsonElement>("/api/Admin/PendingComment");
        var commentId = pending.EnumerateArray()
            .Single(c => c.GetProperty("content").GetString() == content)
            .GetProperty("id").GetInt32();
        (await admin.PostAsJsonAsync("/api/Admin/ApproveComment", new { Id = commentId })).EnsureSuccessStatusCode();
        using var visitor = await ApiClient.ClientForAsync(_factory);

        var first = await visitor.GetAsync($"/api/RentalPosts/{postId}/Comments?_page=1&_limit=10");
        var past = await visitor.GetAsync($"/api/RentalPosts/{postId}/Comments?_page=2&_limit=10");

        Assert.Equal(HttpStatusCode.OK, first.StatusCode);
        Assert.Equal(1, (await first.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("listCommentDtos").GetArrayLength());
        Assert.Equal(HttpStatusCode.NotFound, past.StatusCode);
    }
}
