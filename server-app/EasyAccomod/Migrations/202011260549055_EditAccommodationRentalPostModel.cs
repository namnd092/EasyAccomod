namespace EasyAccomod.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class EditAccommodationRentalPostModel : DbMigration
    {
        public override void Up()
        {
            RenameTable(name: "dbo.RoomRentalPosts", newName: "AccommodationRentalPosts");

            RenameColumn(table: "dbo.Comments", name: "Renter_Id", newName: "RenterId");
            RenameColumn(table: "dbo.Likes", name: "Renter_Id", newName: "RenterId");
            RenameColumn(table: "dbo.Reports", name: "Renter_Id", newName: "RenterId");

            RenameColumn(table: "dbo.AccommodationRentalPosts", name: "Accommodation_Id", newName: "AccommodationId");

            RenameColumn(table: "dbo.Comments", name: "RoomRentalPost_Id", newName: "AccommodationRentalPostId");
            RenameColumn(table: "dbo.Likes", name: "RoomRentalPost_Id", newName: "AccommodationRentalPostId");
            RenameColumn(table: "dbo.Reports", name: "RoomRentalPost_Id", newName: "AccommodationRentalPostId");
            RenameColumn(table: "dbo.Views", name: "RoomRentalPost_Id", newName: "AccommodationRentalPostId");

            RenameIndex(table: "dbo.Comments", name: "IX_Renter_Id", newName: "IX_RenterId");
            RenameIndex(table: "dbo.Comments", name: "IX_RoomRentalPost_Id", newName: "IX_AccommodationRentalPostId");

            RenameIndex(table: "dbo.AccommodationRentalPosts", name: "IX_Accommodation_Id", newName: "IX_AccommodationId");

            RenameIndex(table: "dbo.Likes", name: "IX_Renter_Id", newName: "IX_RenterId");
            RenameIndex(table: "dbo.Likes", name: "IX_RoomRentalPost_Id", newName: "IX_AccommodationRentalPostId");

            RenameIndex(table: "dbo.Reports", name: "IX_Renter_Id", newName: "IX_RenterId");
            RenameIndex(table: "dbo.Reports", name: "IX_RoomRentalPost_Id", newName: "IX_AccommodationRentalPostId");

            RenameIndex(table: "dbo.Views", name: "IX_RoomRentalPost_Id", newName: "IX_AccommodationRentalPostId");
        }

        public override void Down()
        {
            RenameIndex(table: "dbo.Views", name: "IX_AccommodationRentalPostId", newName: "IX_RoomRentalPost_Id");
            RenameIndex(table: "dbo.Reports", name: "IX_AccommodationRentalPostId", newName: "IX_RoomRentalPost_Id");
            RenameIndex(table: "dbo.Reports", name: "IX_RenterId", newName: "IX_Renter_Id");
            RenameIndex(table: "dbo.Likes", name: "IX_AccommodationRentalPostId", newName: "IX_RoomRentalPost_Id");
            RenameIndex(table: "dbo.Likes", name: "IX_RenterId", newName: "IX_Renter_Id");
            RenameIndex(table: "dbo.AccommodationRentalPosts", name: "IX_AccommodationId", newName: "IX_Accommodation_Id");
            RenameIndex(table: "dbo.Comments", name: "IX_AccommodationRentalPostId", newName: "IX_RoomRentalPost_Id");
            RenameIndex(table: "dbo.Comments", name: "IX_RenterId", newName: "IX_Renter_Id");
            RenameColumn(table: "dbo.Views", name: "AccommodationRentalPostId", newName: "RoomRentalPost_Id");
            RenameColumn(table: "dbo.Reports", name: "AccommodationRentalPostId", newName: "RoomRentalPost_Id");
            RenameColumn(table: "dbo.Likes", name: "AccommodationRentalPostId", newName: "RoomRentalPost_Id");
            RenameColumn(table: "dbo.Comments", name: "AccommodationRentalPostId", newName: "RoomRentalPost_Id");
            RenameColumn(table: "dbo.AccommodationRentalPosts", name: "AccommodationId", newName: "Accommodation_Id");
            RenameColumn(table: "dbo.Reports", name: "RenterId", newName: "Renter_Id");
            RenameColumn(table: "dbo.Likes", name: "RenterId", newName: "Renter_Id");
            RenameColumn(table: "dbo.Comments", name: "RenterId", newName: "Renter_Id");
            RenameTable(name: "dbo.AccommodationRentalPosts", newName: "RoomRentalPosts");
        }
    }
}