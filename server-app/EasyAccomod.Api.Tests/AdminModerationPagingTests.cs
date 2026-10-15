using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace EasyAccomod.Api.Tests;

// The admin lists of comments waiting for approval and of reports are paged like the other admin lists.
[Collection(ApiCollection.Name)]
public class AdminModerationPagingTests
{
    private readonly ApiFactory _factory;

    public AdminModerationPagingTests(ApiFactory factory) => _factory = factory;

    [Theory]
    [InlineData("/api/Admin/PendingComment?_page=0")]
    [InlineData("/api/Admin/PendingComment?_limit=0")]
    [InlineData("/api/Admin/PendingComment?_limit=101")]
    [InlineData("/api/Admin/RentalPost/Reports?_page=0")]
    [InlineData("/api/Admin/RentalPost/Reports?_limit=0")]
    [InlineData("/api/Admin/RentalPost/Reports?_limit=101")]
    public async Task Moderation_lists_reject_unusable_paging(string url)
    {
        using var admin = await ApiClient.ClientForAsync(_factory, ApiClient.AdminUser, ApiClient.AdminPassword);

        var response = await admin.GetAsync(url);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Pending_comments_are_split_into_pages_without_losing_or_repeating_any()
    {
        var contents = await CommentOnNewPostsAsync(3);
        using var admin = await ApiClient.ClientForAsync(_factory, ApiClient.AdminUser, ApiClient.AdminPassword);

        var seen = new List<string>();
        var ids = new List<int>();
        var maxPage = 1;
        for (var page = 1; page <= maxPage; page++)
        {
            var result = await admin.GetFromJsonAsync<JsonElement>($"/api/Admin/PendingComment?_page={page}&_limit=2");
            maxPage = result.GetProperty("maxPage").GetInt32();
            var items = result.GetProperty("listCommentDtos").EnumerateArray().ToList();
            Assert.InRange(items.Count, 1, 2);
            seen.AddRange(items.Select(c => c.GetProperty("content").GetString()));
            ids.AddRange(items.Select(c => c.GetProperty("id").GetInt32()));
        }

        Assert.True(maxPage >= 2);
        Assert.Equal(ids.Distinct().Count(), ids.Count);
        Assert.Equal(ids.Order().ToList(), ids);
        Assert.All(contents, content => Assert.Single(seen, content));
    }

    [Fact]
    public async Task A_page_past_the_last_pending_comment_is_empty_and_still_says_how_many_pages_exist()
    {
        await CommentOnNewPostsAsync(1);
        using var admin = await ApiClient.ClientForAsync(_factory, ApiClient.AdminUser, ApiClient.AdminPassword);
        var first = await admin.GetFromJsonAsync<JsonElement>("/api/Admin/PendingComment?_page=1&_limit=1");
        var maxPage = first.GetProperty("maxPage").GetInt32();

        var response = await admin.GetAsync($"/api/Admin/PendingComment?_page={maxPage + 1}&_limit=1");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var past = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal(0, past.GetProperty("listCommentDtos").GetArrayLength());
        Assert.Equal(maxPage, past.GetProperty("maxPage").GetInt32());
    }

    [Fact]
    public async Task A_comment_leaves_the_pending_list_once_it_is_approved()
    {
        var content = (await CommentOnNewPostsAsync(1)).Single();
        using var admin = await ApiClient.ClientForAsync(_factory, ApiClient.AdminUser, ApiClient.AdminPassword);
        var commentId = await FindPendingCommentIdAsync(admin, content);

        (await admin.PostAsJsonAsync("/api/Admin/ApproveComment", new { Id = commentId })).EnsureSuccessStatusCode();

        Assert.Null(await TryFindPendingCommentIdAsync(admin, content));
    }

    [Fact]
    public async Task Reports_are_split_into_pages_without_losing_or_repeating_any()
    {
        var titles = await ReportNewPostsAsync(3);
        using var admin = await ApiClient.ClientForAsync(_factory, ApiClient.AdminUser, ApiClient.AdminPassword);

        var seen = new List<string>();
        var ids = new List<int>();
        var maxPage = 1;
        for (var page = 1; page <= maxPage; page++)
        {
            var result = await admin.GetFromJsonAsync<JsonElement>($"/api/Admin/RentalPost/Reports?_page={page}&_limit=2");
            maxPage = result.GetProperty("maxPage").GetInt32();
            var items = result.GetProperty("reports").EnumerateArray().ToList();
            Assert.InRange(items.Count, 1, 2);
            seen.AddRange(items.Select(r => r.GetProperty("content").GetString()));
            ids.AddRange(items.Select(r => r.GetProperty("id").GetInt32()));
        }

        Assert.True(maxPage >= 2);
        Assert.Equal(ids.Distinct().Count(), ids.Count);
        Assert.Equal(ids.Order().ToList(), ids);
        Assert.All(titles, content => Assert.Single(seen, content));
    }

    [Fact]
    public async Task A_page_past_the_last_report_is_empty_and_still_says_how_many_pages_exist()
    {
        await ReportNewPostsAsync(1);
        using var admin = await ApiClient.ClientForAsync(_factory, ApiClient.AdminUser, ApiClient.AdminPassword);
        var first = await admin.GetFromJsonAsync<JsonElement>("/api/Admin/RentalPost/Reports?_page=1&_limit=1");
        var maxPage = first.GetProperty("maxPage").GetInt32();

        var response = await admin.GetAsync($"/api/Admin/RentalPost/Reports?_page={maxPage + 1}&_limit=1");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var past = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal(0, past.GetProperty("reports").GetArrayLength());
        Assert.Equal(maxPage, past.GetProperty("maxPage").GetInt32());
    }

    [Fact]
    public async Task A_report_moves_to_the_solved_list_once_it_is_resolved()
    {
        var content = (await ReportNewPostsAsync(1)).Single();
        using var admin = await ApiClient.ClientForAsync(_factory, ApiClient.AdminUser, ApiClient.AdminPassword);
        var reportId = await FindReportIdAsync(admin, content, isSolved: false);

        (await admin.PostAsJsonAsync("/api/Admin/RentalPost/ResolveReport", new { Id = reportId })).EnsureSuccessStatusCode();

        Assert.Equal(reportId, await FindReportIdAsync(admin, content, isSolved: true));
        Assert.Null(await TryFindReportIdAsync(admin, content, isSolved: false));
    }

    // One comment from the renter on each of `count` new approved posts, answering what they wrote.
    private async Task<List<string>> CommentOnNewPostsAsync(int count)
    {
        using var renter = await ApiClient.ClientForAsync(_factory, ApiClient.RenterUser, ApiClient.RenterPassword);
        var contents = new List<string>();
        for (var i = 0; i < count; i++)
        {
            var postId = await ApiClient.CreateApprovedPostAsync(_factory);
            var content = "Chờ duyệt " + Guid.NewGuid().ToString("N");
            (await renter.PostAsJsonAsync(
                "/api/Renter/RentalPost/Comment",
                new { AccommodationRentalPostId = postId, Rate = 3, Content = content })).EnsureSuccessStatusCode();
            contents.Add(content);
        }

        return contents;
    }

    // One report from the renter on each of `count` new approved posts (a renter can report a post only once).
    private async Task<List<string>> ReportNewPostsAsync(int count)
    {
        using var renter = await ApiClient.ClientForAsync(_factory, ApiClient.RenterUser, ApiClient.RenterPassword);
        var contents = new List<string>();
        for (var i = 0; i < count; i++)
        {
            var postId = await ApiClient.CreateApprovedPostAsync(_factory);
            var content = "Báo cáo " + Guid.NewGuid().ToString("N");
            (await renter.PostAsJsonAsync(
                "/api/Renter/RentalPost/Report",
                new { AccommodationRentalPostId = postId, Content = content })).EnsureSuccessStatusCode();
            contents.Add(content);
        }

        return contents;
    }

    private static async Task<int?> TryFindPendingCommentIdAsync(HttpClient admin, string content)
    {
        var result = await admin.GetFromJsonAsync<JsonElement>("/api/Admin/PendingComment?_page=1&_limit=100");
        var maxPage = result.GetProperty("maxPage").GetInt32();
        for (var page = 1; ; page++)
        {
            foreach (var comment in result.GetProperty("listCommentDtos").EnumerateArray())
                if (comment.GetProperty("content").GetString() == content)
                    return comment.GetProperty("id").GetInt32();

            if (page >= maxPage)
                return null;
            result = await admin.GetFromJsonAsync<JsonElement>($"/api/Admin/PendingComment?_page={page + 1}&_limit=100");
        }
    }

    private static async Task<int> FindPendingCommentIdAsync(HttpClient admin, string content) =>
        await TryFindPendingCommentIdAsync(admin, content) ?? throw new InvalidOperationException("Comment is not pending.");

    private static async Task<int?> TryFindReportIdAsync(HttpClient admin, string content, bool isSolved)
    {
        var result = await admin.GetFromJsonAsync<JsonElement>($"/api/Admin/RentalPost/Reports?isSolved={isSolved}&_page=1&_limit=100");
        var maxPage = result.GetProperty("maxPage").GetInt32();
        for (var page = 1; ; page++)
        {
            foreach (var report in result.GetProperty("reports").EnumerateArray())
                if (report.GetProperty("content").GetString() == content)
                    return report.GetProperty("id").GetInt32();

            if (page >= maxPage)
                return null;
            result = await admin.GetFromJsonAsync<JsonElement>($"/api/Admin/RentalPost/Reports?isSolved={isSolved}&_page={page + 1}&_limit=100");
        }
    }

    private static async Task<int> FindReportIdAsync(HttpClient admin, string content, bool isSolved) =>
        await TryFindReportIdAsync(admin, content, isSolved) ?? throw new InvalidOperationException("Report not found.");
}
