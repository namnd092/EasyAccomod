namespace EasyAccomod.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddTitleAndContentToAccommodationRentalPost : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AccommodationRentalPosts", "Title", c => c.String(nullable: false));
            AddColumn("dbo.AccommodationRentalPosts", "Content", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.AccommodationRentalPosts", "Content");
            DropColumn("dbo.AccommodationRentalPosts", "Title");
        }
    }
}
