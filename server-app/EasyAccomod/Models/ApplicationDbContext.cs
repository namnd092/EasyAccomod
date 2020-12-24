using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using EasyAccomod.Models.AddressModel;
using Microsoft.AspNet.Identity.EntityFramework;

namespace EasyAccomod.Models
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
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

        public ApplicationDbContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }
    }
}