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

    [Fact]
    public async Task Search_rejects_an_invalid_tri_state_filter()
    {
        using var client = await ApiClient.ClientForAsync(_factory);

        var response = await client.GetAsync("/api/RentalPosts/Search?haveBalcony=5");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
