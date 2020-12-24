namespace EasyAccomod.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class EditAccommodationRentalPost : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.AccommodationPictures", "Accommodation_Id", "dbo.Accommodations");
            DropIndex("dbo.AccommodationPictures", new[] { "Accommodation_Id" });

            AddColumn("dbo.AccommodationPictures", "AccommodationRentalPostId", c => c.Int(nullable: false));
            AlterColumn("dbo.AccommodationRentalPosts", "DateExpired", c => c.DateTime(nullable: false));
            CreateIndex("dbo.AccommodationPictures", "AccommodationRentalPostId");
            AddForeignKey("dbo.AccommodationPictures", "AccommodationRentalPostId", "dbo.AccommodationRentalPosts", "Id", cascadeDelete: true);

            DropColumn("dbo.AccommodationPictures", "Accommodation_Id");
            DropColumn("dbo.AccommodationRentalPosts", "Views");
            DropColumn("dbo.AccommodationRentalPosts", "Likes");
        }

        public override void Down()
        {
            AddColumn("dbo.AccommodationRentalPosts", "Likes", c => c.Int(nullable: false));
            AddColumn("dbo.AccommodationRentalPosts", "Views", c => c.Int(nullable: false));
            AddColumn("dbo.AccommodationPictures", "Accommodation_Id", c => c.Int(nullable: false));
            DropForeignKey("dbo.AccommodationPictures", "AccommodationRentalPostId", "dbo.AccommodationRentalPosts");
            DropIndex("dbo.AccommodationPictures", new[] { "AccommodationRentalPostId" });
            AlterColumn("dbo.AccommodationRentalPosts", "DateExpired", c => c.DateTime());
            DropColumn("dbo.AccommodationPictures", "AccommodationRentalPostId");
            CreateIndex("dbo.AccommodationPictures", "Accommodation_Id");
            AddForeignKey("dbo.AccommodationPictures", "Accommodation_Id", "dbo.Accommodations", "Id", cascadeDelete: true);
        }
    }
}