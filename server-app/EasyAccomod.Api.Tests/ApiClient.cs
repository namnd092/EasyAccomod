using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace EasyAccomod.Api.Tests;

// Small helpers shared by the test classes.
public static class ApiClient
{
    public const string AdminUser = "Admin", AdminPassword = "Admin1234.";
    public const string OwnerUser = "Owner1", OwnerPassword = "Owner1234.";
    public const string RenterUser = "Renter1", RenterPassword = "Renter1234.";
    public const string PendingOwnerUser = "Owner2", PendingOwnerPassword = "Owner1234.";

    // Ids of the seeded lookup rows used by the smoke test: post status 2 is "approved".
    private const byte ApprovedStatusId = 2;

    public static async Task<LoginResult> LoginAsync(HttpClient client, string userName, string password)
    {
        var response = await client.PostAsJsonAsync("/api/Account/Token", new { UserName = userName, Password = password });
        response.EnsureSuccessStatusCode();
        using var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        return new LoginResult(
            json.RootElement.GetProperty("access_token").GetString(),
            json.RootElement.GetProperty("account_id").GetString());
    }

    // A client that sends the bearer token of the given user (or none for an anonymous visitor).
    public static async Task<HttpClient> ClientForAsync(ApiFactory factory, string userName = null, string password = null)
    {
        var client = factory.CreateClient();
        if (userName != null)
        {
            var login = await LoginAsync(client, userName, password);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", login.Token);
        }

        return client;
    }

    public static async Task<int> CreateApprovedPostAsync(ApiFactory factory, string street = null)
    {
        using var owner = await ClientForAsync(factory, OwnerUser, OwnerPassword);
        var created = await owner.PostAsJsonAsync("/api/RentalPosts", NewPostBody(street ?? "Ngõ " + Guid.NewGuid().ToString("N")));
        created.EnsureSuccessStatusCode();
        using var json = JsonDocument.Parse(await created.Content.ReadAsStringAsync());
        var postId = json.RootElement.GetProperty("id").GetInt32();

        using var admin = await ClientForAsync(factory, AdminUser, AdminPassword);
        var approved = await admin.PutAsJsonAsync("/api/Admin/RentalPost/SetStatus", new { Id = ApprovedStatusId, PostId = postId });
        approved.EnsureSuccessStatusCode();
        return postId;
    }

    public static async Task<int> GetViewsAsync(HttpClient client, int postId) =>
        await client.GetFromJsonAsync<int>($"/api/RentalPosts/{postId}/Views");

    private static object NewPostBody(string street) => new
    {
        Title = "Phòng test",
        Content = "Phòng đẹp, gần trung tâm",
        AccommodationPictures = Enumerable.Range(0, 3).Select(i => new { PictureLink = $"https://example.com/{i}.jpg" }).ToArray(),
        Accommodation = new
        {
            Address = new { ProvinceId = 1, DistrictId = 1, WardId = 1, Street = street, PublicLocationNearby = "Gần Hồ Gươm" },
            AccommodationTypeId = 1,
            RoomQuantity = 2,
            PaymentTypeId = 1,
            Price = 3000000,
            RoomAreaRangeId = 2,
            LiveWithOwner = false,
            HaveClosedBathroom = true,
            HaveWaterHeater = true,
            KitchenTypeId = 1,
            HaveAirConditioner = true,
            HaveBalcony = false,
            IsStateElectricityPrice = false,
            ElectricityPrice = 3500,
            IsStateWaterPrice = false,
            WaterPrice = 20000,
            RoomOptions = "",
            OwnerId = 0,
        },
        TimeDisplayed = 30,
    };
}

public record LoginResult(string Token, string AccountId);
