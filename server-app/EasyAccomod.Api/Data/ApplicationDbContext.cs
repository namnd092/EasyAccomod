using EasyAccomod.Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace EasyAccomod.Api.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Admin> Admins { get; set; }

    public DbSet<Owner> Owners { get; set; }

    public DbSet<Renter> Renters { get; set; }

    public DbSet<EditInfoRequest> EditInfoRequests { get; set; }

    public DbSet<Accommodation> Accommodations { get; set; }

    public DbSet<AccommodationRentalPost> AccommodationRentalPosts { get; set; }

    public DbSet<RentalPostStatus> RentalPostStatuses { get; set; }

    public DbSet<Like> Likes { get; set; }

    public DbSet<View> Views { get; set; }

    public DbSet<Comment> Comments { get; set; }

    public DbSet<Report> Reports { get; set; }

    public DbSet<AccommodationPicture> AccommodationPictures { get; set; }

    public DbSet<AccommodationType> AccommodationTypes { get; set; }

    public DbSet<KitchenType> KitchenTypes { get; set; }

    public DbSet<AccommodationPaymentType> AccommodationPaymentTypes { get; set; }

    public DbSet<AccommodationStatus> AccommodationStatuses { get; set; }

    public DbSet<RoomAreaRange> RoomAreaRanges { get; set; }

    public DbSet<Address> Addresses { get; set; }

    public DbSet<ExtendRentalPostPeriod> ExtendRentalPostPeriods { get; set; }

    public DbSet<Province> Provinces { get; set; }

    public DbSet<District> Districts { get; set; }

    public DbSet<Ward> Wards { get; set; }

    public DbSet<Notification> Notifications { get; set; }

    public DbSet<RefreshToken> RefreshTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Looks up a viewer's latest view of a post when deduplicating view counts.
        builder.Entity<View>().HasIndex(v => new { v.AccommodationRentalPostId, v.ViewerKey, v.Time });

        builder.Entity<RefreshToken>(entity =>
        {
            entity.Property(t => t.UserId).IsRequired();
            entity.Property(t => t.TokenHash).IsRequired();
            entity.HasIndex(t => t.TokenHash).IsUnique();
            entity.HasIndex(t => t.UserId);
            entity.HasIndex(t => t.FamilyId);
            entity.HasOne(t => t.User).WithMany().HasForeignKey(t => t.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        // Lookup rows are seeded with explicit ids, in the same order as the original EF6 migrations.
        builder.Entity<AccommodationType>().Property(t => t.Id).ValueGeneratedNever();
        builder.Entity<KitchenType>().Property(t => t.Id).ValueGeneratedNever();
        builder.Entity<AccommodationPaymentType>().Property(t => t.Id).ValueGeneratedNever();
        builder.Entity<RoomAreaRange>().Property(t => t.Id).ValueGeneratedNever();
        builder.Entity<AccommodationStatus>().Property(t => t.Id).ValueGeneratedNever();
        builder.Entity<RentalPostStatus>().Property(t => t.Id).ValueGeneratedNever();

        builder.Entity<AccommodationType>().HasData(
            new AccommodationType { Id = 1, Name = "Phòng trọ" },
            new AccommodationType { Id = 2, Name = "Chung cư mini" },
            new AccommodationType { Id = 3, Name = "Nhà nguyên căn" },
            new AccommodationType { Id = 4, Name = "Chung cư nguyên căn" });

        builder.Entity<KitchenType>().HasData(
            new KitchenType { Id = 1, Name = "Khu bếp riêng" },
            new KitchenType { Id = 2, Name = "Khu bếp chung" },
            new KitchenType { Id = 3, Name = "Không nấu ăn" });

        builder.Entity<RoomAreaRange>().HasData(
            new RoomAreaRange { Id = 1, Range = "10-20m2" },
            new RoomAreaRange { Id = 2, Range = "20-30m2" },
            new RoomAreaRange { Id = 3, Range = "30-40m2" },
            new RoomAreaRange { Id = 4, Range = ">40m2" });

        builder.Entity<AccommodationPaymentType>().HasData(
            new AccommodationPaymentType { Id = 1, Name = "Tháng" },
            new AccommodationPaymentType { Id = 2, Name = "Quý" },
            new AccommodationPaymentType { Id = 3, Name = "Năm" });

        builder.Entity<AccommodationStatus>().HasData(
            new AccommodationStatus { Id = 1, Name = AccommodationStatusName.NotRented },
            new AccommodationStatus { Id = 2, Name = AccommodationStatusName.Rented });

        builder.Entity<RentalPostStatus>().HasData(
            new RentalPostStatus { Id = 1, Name = RentalPostStatusName.PendingApproval },
            new RentalPostStatus { Id = 2, Name = RentalPostStatusName.Approved },
            new RentalPostStatus { Id = 3, Name = RentalPostStatusName.Rejected },
            new RentalPostStatus { Id = 4, Name = RentalPostStatusName.Editing },
            new RentalPostStatus { Id = 5, Name = RentalPostStatusName.WaitingEditPermission });
    }
}
