namespace EasyAccomod.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class EditAccommodationTableInDb : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Accommodations", "PublicLocationsNearby");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Accommodations", "PublicLocationsNearby", c => c.String());
        }
    }
}
