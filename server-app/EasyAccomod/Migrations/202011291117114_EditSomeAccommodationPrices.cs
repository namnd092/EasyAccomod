namespace EasyAccomod.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class EditSomeAccommodationPrices : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Accommodations", "IsStateElectricityPrice", c => c.Boolean(nullable: false));
            AddColumn("dbo.Accommodations", "IsStateWaterPrice", c => c.Boolean(nullable: false));
            AlterColumn("dbo.Accommodations", "Price", c => c.Int(nullable: false));
            AlterColumn("dbo.Accommodations", "ElectricityPrice", c => c.Int(nullable: false));
            AlterColumn("dbo.Accommodations", "WaterPrice", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Accommodations", "WaterPrice", c => c.String(nullable: false));
            AlterColumn("dbo.Accommodations", "ElectricityPrice", c => c.String(nullable: false));
            AlterColumn("dbo.Accommodations", "Price", c => c.String());
            DropColumn("dbo.Accommodations", "IsStateWaterPrice");
            DropColumn("dbo.Accommodations", "IsStateElectricityPrice");
        }
    }
}
