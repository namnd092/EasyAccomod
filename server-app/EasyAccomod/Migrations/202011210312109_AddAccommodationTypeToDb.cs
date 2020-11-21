namespace EasyAccomod.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddAccommodationTypeToDb : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.AccommodationTypes",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.Accommodations", "AccommodationType_Id", c => c.Int(nullable: false));
            CreateIndex("dbo.Accommodations", "AccommodationType_Id");
            AddForeignKey("dbo.Accommodations", "AccommodationType_Id", "dbo.AccommodationTypes", "Id", cascadeDelete: true);
            DropColumn("dbo.Accommodations", "RoomType");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Accommodations", "RoomType", c => c.String(nullable: false));
            DropForeignKey("dbo.Accommodations", "AccommodationType_Id", "dbo.AccommodationTypes");
            DropIndex("dbo.Accommodations", new[] { "AccommodationType_Id" });
            DropColumn("dbo.Accommodations", "AccommodationType_Id");
            DropTable("dbo.AccommodationTypes");
        }
    }
}
