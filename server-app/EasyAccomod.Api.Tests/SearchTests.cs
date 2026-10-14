using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace EasyAccomod.Api.Tests;

[Collection(ApiCollection.Name)]
public class SearchTests
{
    private readonly ApiFactory _factory;

    public SearchTests(ApiFactory factory) => _factory = factory;

    [Fact]
    public async Task Search_finds_an_approved_post_by_street_ignoring_case()
    {
        var street = "Ngõ Tìm " + Guid.NewGuid().ToString("N");
        var postId = await ApiClient.CreateApprovedPostAsync(_factory, street);
        using var client = await ApiClient.ClientForAsync(_factory);

        var response = await client.GetAsync("/api/RentalPosts/Search?_limit=50&street=" + Uri.EscapeDataString(street.ToUpperInvariant()));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        var posts = json.RootElement.GetProperty("simplePostDtos").EnumerateArray().ToList();
        var post = Assert.Single(posts);
        Assert.Equal(postId, post.GetProperty("id").GetInt32());
        Assert.Equal(1, json.RootElement.GetProperty("maxPage").GetInt32());
    }

    [Fact]
    public async Task A_pending_post_is_not_found_by_search_or_by_anonymous_visitors()
    {
        var street = "Ngõ Chờ " + Guid.NewGuid().ToString("N");
        using var owner = await ApiClient.ClientForAsync(_factory, ApiClient.OwnerUser, ApiClient.OwnerPassword);
        var created = await owner.PostAsJsonAsync("/api/RentalPosts", new
        {
            Title = "Phòng chờ duyệt",
            Content = "x",
            AccommodationPictures = Enumerable.Range(0, 3).Select(i => new { PictureLink = $"https://example.com/{i}.jpg" }).ToArray(),
            Accommodation = new
            {
                Address = new { ProvinceId = 1, DistrictId = 1, WardId = 1, Street = street, PublicLocationNearby = "x" },
                AccommodationTypeId = 1, RoomQuantity = 1, PaymentTypeId = 1, Price = 1000000, RoomAreaRangeId = 1,
                LiveWithOwner = false, HaveClosedBathroom = true, HaveWaterHeater = true, KitchenTypeId = 1,
                HaveAirConditioner = false, HaveBalcony = false, IsStateElectricityPrice = true,
                ElectricityPrice = 0, IsStateWaterPrice = true, WaterPrice = 0, RoomOptions = "", OwnerId = 0,
            },
            TimeDisplayed = 30,
        });
        Assert.Equal(HttpStatusCode.Created, created.StatusCode);
        using var createdJson = JsonDocument.Parse(await created.Content.ReadAsStringAsync());
        var postId = createdJson.RootElement.GetProperty("id").GetInt32();
        using var anonymous = await ApiClient.ClientForAsync(_factory);

        var search = await anonymous.GetFromJsonAsync<JsonElement>("/api/RentalPosts/Search?_limit=50&street=" + Uri.EscapeDataString(street));
        var detail = await anonymous.GetAsync($"/api/RentalPosts/Get/{postId}");

        Assert.Equal(0, search.GetProperty("simplePostDtos").GetArrayLength());
        Assert.Equal(HttpStatusCode.NotFound, detail.StatusCode);
    }

    // Posts that share a street token are found together with ?street=<token>, which keeps each test
    // apart from the posts the other tests create in the same database.
    private async Task<(string Token, int[] Ids)> CreatePostsAsync(params int[] prices)
    {
        var token = "Ngõ Nhóm " + Guid.NewGuid().ToString("N");
        var ids = new List<int>();
        foreach (var price in prices)
            ids.Add(await ApiClient.CreateApprovedPostAsync(_factory, token + " " + ids.Count, price));
        return (token, ids.ToArray());
    }

    private async Task<JsonElement> SearchAsync(string token, string query = "")
    {
        using var client = await ApiClient.ClientForAsync(_factory);
        var response = await client.GetAsync("/api/RentalPosts/Search?_limit=50&street=" + Uri.EscapeDataString(token) + query);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        return json.RootElement.Clone();
    }

    private static int[] IdsOf(JsonElement result) =>
        result.GetProperty("simplePostDtos").EnumerateArray().Select(p => p.GetProperty("id").GetInt32()).ToArray();

    [Fact]
    public async Task Search_keeps_posts_in_the_order_they_were_created_by_default()
    {
        var (token, ids) = await CreatePostsAsync(5000000, 1000000, 3000000);

        var result = await SearchAsync(token);

        Assert.Equal(ids, IdsOf(result));
    }

    [Theory]
    [InlineData("priceAsc", new[] { 1, 2, 0 })]
    [InlineData("priceDesc", new[] { 0, 2, 1 })]
    [InlineData("newest", new[] { 2, 1, 0 })]
    public async Task Search_sorts_by_the_requested_order(string sortBy, int[] expectedOrder)
    {
        // Created in this order: 5 triệu, 1 triệu, 3 triệu.
        var (token, ids) = await CreatePostsAsync(5000000, 1000000, 3000000);

        var result = await SearchAsync(token, "&sortBy=" + sortBy);

        Assert.Equal(expectedOrder.Select(i => ids[i]), IdsOf(result));
    }

    [Fact]
    public async Task Search_sorts_across_pages()
    {
        var (token, ids) = await CreatePostsAsync(5000000, 1000000, 3000000);
        using var client = await ApiClient.ClientForAsync(_factory);

        var second = await client.GetFromJsonAsync<JsonElement>(
            "/api/RentalPosts/Search?_limit=2&_page=2&sortBy=priceAsc&street=" + Uri.EscapeDataString(token));

        Assert.Equal(new[] { ids[0] }, IdsOf(second));
    }

    [Fact]
    public async Task Search_rejects_an_unknown_sort_order()
    {
        using var client = await ApiClient.ClientForAsync(_factory);

        var response = await client.GetAsync("/api/RentalPosts/Search?sortBy=cheapest");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Search_reports_how_many_posts_matched_across_all_pages()
    {
        var (token, _) = await CreatePostsAsync(1000000, 2000000, 3000000);
        using var client = await ApiClient.ClientForAsync(_factory);

        var result = await client.GetFromJsonAsync<JsonElement>(
            "/api/RentalPosts/Search?_limit=2&street=" + Uri.EscapeDataString(token));

        Assert.Equal(2, result.GetProperty("simplePostDtos").GetArrayLength());
        Assert.Equal(2, result.GetProperty("maxPage").GetInt32());
        Assert.Equal(3, result.GetProperty("totalCount").GetInt32());
    }

    [Fact]
    public async Task Search_reports_a_total_of_zero_when_nothing_matched()
    {
        var result = await SearchAsync("Không có ngõ này " + Guid.NewGuid().ToString("N"));

        Assert.Equal(0, result.GetProperty("totalCount").GetInt32());
    }

    [Theory]
    [InlineData("&minPrice=2000000&maxPrice=3000000", new[] { 1 })]
    [InlineData("&minPrice=2000000", new[] { 1, 2 })]
    [InlineData("&maxPrice=2000000", new[] { 0 })]
    [InlineData("&minPrice=2000000&maxPrice=3000000&paymentTypeId=1", new[] { 1 })]
    [InlineData("&minPrice=2000000&maxPrice=3000000&paymentTypeId=2", new int[0])]
    public async Task Search_filters_by_price_whether_or_not_a_payment_type_is_given(string query, int[] expectedPosts)
    {
        // 1,5 triệu, 2,5 triệu and 6 triệu a month.
        var (token, ids) = await CreatePostsAsync(1500000, 2500000, 6000000);

        var result = await SearchAsync(token, query);

        Assert.Equal(expectedPosts.Select(i => ids[i]), IdsOf(result));
    }

    [Fact]
    public async Task Search_rejects_an_invalid_tri_state_filter()
    {
        using var client = await ApiClient.ClientForAsync(_factory);

        var response = await client.GetAsync("/api/RentalPosts/Search?haveBalcony=5");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
