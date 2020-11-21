namespace EasyAccomod.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddAccommodationPictureToDb : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.AccommodationPictures",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        PictureLink = c.String(nullable: false),
                        Accommodation_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Accommodations", t => t.Accommodation_Id, cascadeDelete: true)
                .Index(t => t.Accommodation_Id);
            
            DropColumn("dbo.Accommodations", "RoomPicturesLink");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Accommodations", "RoomPicturesLink", c => c.String(nullable: false));
            DropForeignKey("dbo.AccommodationPictures", "Accommodation_Id", "dbo.Accommodations");
            DropIndex("dbo.AccommodationPictures", new[] { "Accommodation_Id" });
            DropTable("dbo.AccommodationPictures");
        }
    }
}
