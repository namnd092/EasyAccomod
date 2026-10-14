using System.Net;
using System.Net.Http.Json;
using EasyAccomod.Api.Data;
using EasyAccomod.Api.Models;
using Microsoft.Extensions.DependencyInjection;

namespace EasyAccomod.Api.Tests;

[Collection(ApiCollection.Name)]
public class ViewCountTests
{
    private readonly ApiFactory _factory;

    public ViewCountTests(ApiFactory factory) => _factory = factory;

    [Fact]
    public async Task A_visitor_viewing_the_same_post_repeatedly_counts_once()
    {
        var postId = await ApiClient.CreateApprovedPostAsync(_factory);
        using var visitor = await ApiClient.ClientForAsync(_factory);

        for (var i = 0; i < 3; i++)
            Assert.Equal(HttpStatusCode.OK, (await visitor.GetAsync($"/api/RentalPosts/Get/{postId}")).StatusCode);

        Assert.Equal(1, await ApiClient.GetViewsAsync(visitor, postId));
    }

    [Fact]
    public async Task Different_viewers_each_count_once()
    {
        var postId = await ApiClient.CreateApprovedPostAsync(_factory);
        using var visitor = await ApiClient.ClientForAsync(_factory);
        using var renter = await ApiClient.ClientForAsync(_factory, ApiClient.RenterUser, ApiClient.RenterPassword);

        await visitor.GetAsync($"/api/RentalPosts/Get/{postId}");
        await renter.GetAsync($"/api/RentalPosts/Get/{postId}");
        await renter.GetAsync($"/api/RentalPosts/Get/{postId}");

        Assert.Equal(2, await ApiClient.GetViewsAsync(visitor, postId));
    }

    [Fact]
    public async Task Views_by_the_posts_owner_and_by_an_admin_are_not_counted()
    {
        var postId = await ApiClient.CreateApprovedPostAsync(_factory);
        using var owner = await ApiClient.ClientForAsync(_factory, ApiClient.OwnerUser, ApiClient.OwnerPassword);
        using var admin = await ApiClient.ClientForAsync(_factory, ApiClient.AdminUser, ApiClient.AdminPassword);

        Assert.Equal(HttpStatusCode.OK, (await owner.GetAsync($"/api/RentalPosts/Get/{postId}")).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await admin.GetAsync($"/api/RentalPosts/Get/{postId}")).StatusCode);

        Assert.Equal(0, await ApiClient.GetViewsAsync(owner, postId));
    }

    [Fact]
    public async Task A_view_counts_again_once_the_dedupe_window_has_passed()
    {
        var postId = await ApiClient.CreateApprovedPostAsync(_factory);
        using var renter = await ApiClient.ClientForAsync(_factory, ApiClient.RenterUser, ApiClient.RenterPassword);
        var accountId = (await ApiClient.LoginAsync(renter, ApiClient.RenterUser, ApiClient.RenterPassword)).AccountId;

        using (var scope = _factory.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            context.Views.Add(new View
            {
                AccommodationRentalPostId = postId,
                ViewerKey = "u:" + accountId,
                Time = DateTime.UtcNow.AddHours(-2),
            });
            await context.SaveChangesAsync();
        }

        await renter.GetAsync($"/api/RentalPosts/Get/{postId}");
        await renter.GetAsync($"/api/RentalPosts/Get/{postId}");

        // the old view plus one new view; the second request is inside the window
        Assert.Equal(2, await ApiClient.GetViewsAsync(renter, postId));
    }
}
