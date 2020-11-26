namespace EasyAccomod.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ChangeTypeOfWaterPriceAndElectricityPriceToString : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Accommodations", "ElectricityPrice", c => c.String(nullable: false));
            AlterColumn("dbo.Accommodations", "WaterPrice", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Accommodations", "WaterPrice", c => c.Int(nullable: false));
            AlterColumn("dbo.Accommodations", "ElectricityPrice", c => c.Int(nullable: false));
        }
    }
}
