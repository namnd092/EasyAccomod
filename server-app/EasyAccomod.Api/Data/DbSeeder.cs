using System.Text.Json;
using System.Text.Json.Serialization;
using EasyAccomod.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EasyAccomod.Api.Data;

public class DbSeeder
{
    private static readonly string[] Roles =
    {
        RoleName.Admin, RoleName.Owner, RoleName.Renter, RoleName.WaitForConfirmation,
    };

    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public DbSeeder(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager)
    {
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task SeedAsync(bool seedDemoAccounts)
    {
        await _context.Database.MigrateAsync();
        await SeedRolesAsync();
        await SeedAddressesAsync();

        if (seedDemoAccounts)
        {
            await SeedDemoAccountsAsync();
        }
    }

    private async Task SeedRolesAsync()
    {
        foreach (var role in Roles)
        {
            if (!await _roleManager.RoleExistsAsync(role))
            {
                await _roleManager.CreateAsync(new IdentityRole(role));
            }
        }
    }

    private async Task SeedDemoAccountsAsync()
    {
        await EnsureAccountAsync("Admin", "admin@admin.com", "Admin1234.", RoleName.Admin, user =>
            _context.Admins.Add(new Admin { Name = user.UserName, Email = user.Email, AccountId = user.Id }));

        await EnsureAccountAsync("Owner1", "owner1@owner.com", "Owner1234.", RoleName.Owner, user =>
            _context.Owners.Add(NewDemoOwner(user)));

        await EnsureAccountAsync("Renter1", "renter1@renter.com", "Renter1234.", RoleName.Renter, user =>
            _context.Renters.Add(new Renter { Name = user.UserName, Email = user.Email, AccountId = user.Id }));

        await EnsureAccountAsync("Owner2", "owner2@owner.com", "Owner1234.", RoleName.WaitForConfirmation, user =>
            _context.Owners.Add(NewDemoOwner(user)));
    }

    private static Owner NewDemoOwner(ApplicationUser user) => new Owner
    {
        Name = user.UserName,
        Email = user.Email,
        AccountId = user.Id,
        Address = "HN",
        Identification = "123456789",
        Phone = "0987654321",
    };

    private async Task EnsureAccountAsync(
        string userName, string email, string password, string role, Action<ApplicationUser> addProfile)
    {
        if (await _userManager.FindByNameAsync(userName) != null)
        {
            return;
        }

        var user = new ApplicationUser { UserName = userName, Email = email };
        var result = await _userManager.CreateAsync(user, password);
        if (!result.Succeeded)
        {
            throw new InvalidOperationException(
                $"Could not seed account {userName}: " + string.Join("; ", result.Errors.Select(e => e.Description)));
        }

        await _userManager.AddToRoleAsync(user, role);
        addProfile(user);
        await _context.SaveChangesAsync();
    }

    private async Task SeedAddressesAsync()
    {
        if (await _context.Provinces.AnyAsync())
        {
            return;
        }

        var path = Path.Combine(AppContext.BaseDirectory, "Data", "Province_District_Ward.json");
        await using var stream = File.OpenRead(path);
        var provinces = await JsonSerializer.DeserializeAsync<List<ProvinceJson>>(
            stream, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        foreach (var province in provinces)
        {
            _context.Provinces.Add(new Province { Id = province.Id, Name = province.Name });

            foreach (var district in province.Districts)
            {
                _context.Districts.Add(new District
                {
                    Id = district.Id,
                    Name = district.Name,
                    ProvinceId = district.ProvinceId,
                });

                foreach (var ward in district.Wards)
                {
                    _context.Wards.Add(new Ward { Id = ward.Id, Name = ward.Name, DistrictId = ward.DistrictId });
                }
            }
        }

        await _context.SaveChangesAsync();
    }

    private class ProvinceJson
    {
        public byte Id { get; set; }

        public string Name { get; set; }

        [JsonPropertyName("huyen")]
        public List<DistrictJson> Districts { get; set; }
    }

    private class DistrictJson
    {
        public int Id { get; set; }

        public string Name { get; set; }

        [JsonPropertyName("tinh_id")]
        public byte ProvinceId { get; set; }

        [JsonPropertyName("xa")]
        public List<WardJson> Wards { get; set; }
    }

    private class WardJson
    {
        public int Id { get; set; }

        public string Name { get; set; }

        [JsonPropertyName("huyen_id")]
        public int DistrictId { get; set; }
    }
}
