namespace EasyAccomod.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddAddressModelToDb : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Addresses",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Street = c.String(),
                        Accommodation_Id = c.Int(nullable: false),
                        District_Id = c.Int(),
                        Province_Id = c.Byte(),
                        Ward_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Accommodations", t => t.Accommodation_Id, cascadeDelete: true)
                .ForeignKey("dbo.Districts", t => t.District_Id)
                .ForeignKey("dbo.Provinces", t => t.Province_Id)
                .ForeignKey("dbo.Wards", t => t.Ward_Id)
                .Index(t => t.Accommodation_Id)
                .Index(t => t.District_Id)
                .Index(t => t.Province_Id)
                .Index(t => t.Ward_Id);
            
            CreateTable(
                "dbo.Districts",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                        Province_Id = c.Byte(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Provinces", t => t.Province_Id, cascadeDelete: true)
                .Index(t => t.Province_Id);
            
            CreateTable(
                "dbo.Provinces",
                c => new
                    {
                        Id = c.Byte(nullable: false),
                        Name = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Wards",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                        District_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Districts", t => t.District_Id, cascadeDelete: true)
                .Index(t => t.District_Id);
            
            DropColumn("dbo.Accommodations", "Address");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Accommodations", "Address", c => c.String(nullable: false));
            DropForeignKey("dbo.Addresses", "Ward_Id", "dbo.Wards");
            DropForeignKey("dbo.Wards", "District_Id", "dbo.Districts");
            DropForeignKey("dbo.Addresses", "Province_Id", "dbo.Provinces");
            DropForeignKey("dbo.Addresses", "District_Id", "dbo.Districts");
            DropForeignKey("dbo.Districts", "Province_Id", "dbo.Provinces");
            DropForeignKey("dbo.Addresses", "Accommodation_Id", "dbo.Accommodations");
            DropIndex("dbo.Wards", new[] { "District_Id" });
            DropIndex("dbo.Districts", new[] { "Province_Id" });
            DropIndex("dbo.Addresses", new[] { "Ward_Id" });
            DropIndex("dbo.Addresses", new[] { "Province_Id" });
            DropIndex("dbo.Addresses", new[] { "District_Id" });
            DropIndex("dbo.Addresses", new[] { "Accommodation_Id" });
            DropTable("dbo.Wards");
            DropTable("dbo.Provinces");
            DropTable("dbo.Districts");
            DropTable("dbo.Addresses");
        }
    }
}
