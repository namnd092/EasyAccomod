namespace EasyAccomod.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class EditModel : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Views", "Renter_Id", "dbo.Renters");
            DropIndex("dbo.Views", new[] { "Renter_Id" });
            AddColumn("dbo.Comments", "Time", c => c.DateTime(nullable: false));
            AddColumn("dbo.Likes", "Time", c => c.DateTime(nullable: false));
            AddColumn("dbo.Reports", "Time", c => c.DateTime(nullable: false));
            AddColumn("dbo.Views", "Time", c => c.DateTime(nullable: false));
            DropColumn("dbo.Views", "Renter_Id");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Views", "Renter_Id", c => c.Int(nullable: false));
            DropColumn("dbo.Views", "Time");
            DropColumn("dbo.Reports", "Time");
            DropColumn("dbo.Likes", "Time");
            DropColumn("dbo.Comments", "Time");
            CreateIndex("dbo.Views", "Renter_Id");
            AddForeignKey("dbo.Views", "Renter_Id", "dbo.Renters", "Id", cascadeDelete: true);
        }
    }
}
