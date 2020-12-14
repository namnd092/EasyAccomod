namespace EasyAccomod.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddExtendRentalPostPeriod : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.ExtendRentalPostPeriods",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        AccommodationRentalPostId = c.Int(nullable: false),
                        ExtendPeriod = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AccommodationRentalPosts", t => t.AccommodationRentalPostId, cascadeDelete: true)
                .Index(t => t.AccommodationRentalPostId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ExtendRentalPostPeriods", "AccommodationRentalPostId", "dbo.AccommodationRentalPosts");
            DropIndex("dbo.ExtendRentalPostPeriods", new[] { "AccommodationRentalPostId" });
            DropTable("dbo.ExtendRentalPostPeriods");
        }
    }
}
