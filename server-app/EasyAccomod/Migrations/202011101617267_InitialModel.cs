namespace EasyAccomod.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class InitialModel : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Accommodations",
                c => new
                {
                    Id = c.Int(nullable: false, identity: true),
                    Address = c.String(nullable: false),
                    PublicLocationsNearby = c.String(),
                    RoomType = c.String(nullable: false),
                    RoomQuantity = c.Int(nullable: false),
                    RoomPrice = c.String(),
                    RoomArea = c.String(),
                    LiveWithOwner = c.Boolean(nullable: false),
                    HaveClosedBathroom = c.Boolean(nullable: false),
                    HaveWaterHeater = c.Boolean(nullable: false),
                    Kitchen = c.String(nullable: false),
                    HaveAirConditioner = c.Boolean(nullable: false),
                    HaveBalcony = c.Boolean(nullable: false),
                    ElectricityPrice = c.Int(nullable: false),
                    WaterPrice = c.Int(nullable: false),
                    RoomOptions = c.String(),
                    RoomPicturesLink = c.String(nullable: false),
                    Status = c.String(nullable: false),
                    Owner_Id = c.Int(nullable: false),
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Owners", t => t.Owner_Id, cascadeDelete: true)
                .Index(t => t.Owner_Id);

            CreateTable(
                    "dbo.Owners",
                    c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                        Identification = c.String(nullable: false),
                        Address = c.String(nullable: false),
                        Phone = c.String(nullable: false),
                        Email = c.String(nullable: false),
                        AccountId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.AccountId, cascadeDelete: true);

            CreateTable(
                "dbo.Admins",
                c => new
                {
                    Id = c.Byte(nullable: false),
                    Name = c.String(nullable: false),
                    Email = c.String(nullable: false),
                    AccountId = c.String(nullable: false, maxLength: 128),
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.AccountId, cascadeDelete: true);

            CreateTable(
                "dbo.Comments",
                c => new
                {
                    Id = c.Int(nullable: false, identity: true),
                    Content = c.String(nullable: false),
                    Status = c.String(),
                    Renter_Id = c.Int(nullable: false),
                    RoomRentalPost_Id = c.Int(nullable: false),
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Renters", t => t.Renter_Id, cascadeDelete: true)
                .ForeignKey("dbo.RoomRentalPosts", t => t.RoomRentalPost_Id, cascadeDelete: true)
                .Index(t => t.Renter_Id)
                .Index(t => t.RoomRentalPost_Id);

            CreateTable(
                "dbo.Renters",
                c => new
                {
                    Id = c.Int(nullable: false, identity: true),
                    Name = c.String(nullable: false),
                    Email = c.String(nullable: false),
                    AccountId = c.String(nullable: false, maxLength: 128),
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.AccountId, cascadeDelete: true);

            CreateTable(
                "dbo.RoomRentalPosts",
                c => new
                {
                    Id = c.Int(nullable: false, identity: true),
                    DateAdded = c.DateTime(nullable: false),
                    DateExpired = c.DateTime(),
                    Views = c.Int(nullable: false),
                    Likes = c.Int(nullable: false),
                    Accommodation_Id = c.Int(nullable: false),
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Accommodations", t => t.Accommodation_Id, cascadeDelete: false)
                .Index(t => t.Accommodation_Id);

            CreateTable(
                "dbo.Likes",
                c => new
                {
                    Id = c.Int(nullable: false, identity: true),
                    Renter_Id = c.Int(nullable: false),
                    RoomRentalPost_Id = c.Int(nullable: false),
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Renters", t => t.Renter_Id, cascadeDelete: true)
                .ForeignKey("dbo.RoomRentalPosts", t => t.RoomRentalPost_Id, cascadeDelete: true)
                .Index(t => t.Renter_Id)
                .Index(t => t.RoomRentalPost_Id);

            CreateTable(
                "dbo.Reports",
                c => new
                {
                    Id = c.Int(nullable: false, identity: true),
                    Content = c.String(nullable: false),
                    Status = c.String(),
                    Renter_Id = c.Int(nullable: false),
                    RoomRentalPost_Id = c.Int(nullable: false),
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Renters", t => t.Renter_Id, cascadeDelete: true)
                .ForeignKey("dbo.RoomRentalPosts", t => t.RoomRentalPost_Id, cascadeDelete: true)
                .Index(t => t.Renter_Id)
                .Index(t => t.RoomRentalPost_Id);

            CreateTable(
                "dbo.AspNetRoles",
                c => new
                {
                    Id = c.String(nullable: false, maxLength: 128),
                    Name = c.String(nullable: false, maxLength: 256),
                })
                .PrimaryKey(t => t.Id)
                .Index(t => t.Name, unique: true, name: "RoleNameIndex");

            CreateTable(
                "dbo.AspNetUserRoles",
                c => new
                {
                    UserId = c.String(nullable: false, maxLength: 128),
                    RoleId = c.String(nullable: false, maxLength: 128),
                })
                .PrimaryKey(t => new { t.UserId, t.RoleId })
                .ForeignKey("dbo.AspNetRoles", t => t.RoleId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.RoleId);

            CreateTable(
                "dbo.AspNetUsers",
                c => new
                {
                    Id = c.String(nullable: false, maxLength: 128),
                    Email = c.String(maxLength: 256),
                    EmailConfirmed = c.Boolean(nullable: false),
                    PasswordHash = c.String(),
                    SecurityStamp = c.String(),
                    PhoneNumber = c.String(),
                    PhoneNumberConfirmed = c.Boolean(nullable: false),
                    TwoFactorEnabled = c.Boolean(nullable: false),
                    LockoutEndDateUtc = c.DateTime(),
                    LockoutEnabled = c.Boolean(nullable: false),
                    AccessFailedCount = c.Int(nullable: false),
                    UserName = c.String(nullable: false, maxLength: 256),
                })
                .PrimaryKey(t => t.Id)
                .Index(t => t.UserName, unique: true, name: "UserNameIndex");

            CreateTable(
                "dbo.AspNetUserClaims",
                c => new
                {
                    Id = c.Int(nullable: false, identity: true),
                    UserId = c.String(nullable: false, maxLength: 128),
                    ClaimType = c.String(),
                    ClaimValue = c.String(),
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);

            CreateTable(
                "dbo.AspNetUserLogins",
                c => new
                {
                    LoginProvider = c.String(nullable: false, maxLength: 128),
                    ProviderKey = c.String(nullable: false, maxLength: 128),
                    UserId = c.String(nullable: false, maxLength: 128),
                })
                .PrimaryKey(t => new { t.LoginProvider, t.ProviderKey, t.UserId })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);

            CreateTable(
                "dbo.Views",
                c => new
                {
                    Id = c.Int(nullable: false, identity: true),
                    Renter_Id = c.Int(nullable: false),
                    RoomRentalPost_Id = c.Int(nullable: false),
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Renters", t => t.Renter_Id, cascadeDelete: true)
                .ForeignKey("dbo.RoomRentalPosts", t => t.RoomRentalPost_Id, cascadeDelete: true)
                .Index(t => t.Renter_Id)
                .Index(t => t.RoomRentalPost_Id);
        }

        public override void Down()
        {
            DropForeignKey("dbo.Views", "RoomRentalPost_Id", "dbo.RoomRentalPosts");
            DropForeignKey("dbo.Views", "Renter_Id", "dbo.Renters");
            DropForeignKey("dbo.AspNetUserRoles", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserLogins", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserClaims", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserRoles", "RoleId", "dbo.AspNetRoles");
            DropForeignKey("dbo.Reports", "RoomRentalPost_Id", "dbo.RoomRentalPosts");
            DropForeignKey("dbo.Reports", "Renter_Id", "dbo.Renters");
            DropForeignKey("dbo.Likes", "RoomRentalPost_Id", "dbo.RoomRentalPosts");
            DropForeignKey("dbo.Likes", "Renter_Id", "dbo.Renters");
            DropForeignKey("dbo.Comments", "RoomRentalPost_Id", "dbo.RoomRentalPosts");
            DropForeignKey("dbo.RoomRentalPosts", "Accommodation_Id", "dbo.Accommodations");
            DropForeignKey("dbo.Comments", "Renter_Id", "dbo.Renters");
            DropForeignKey("dbo.Accommodations", "Owner_Id", "dbo.Owners");
            DropIndex("dbo.Views", new[] { "RoomRentalPost_Id" });
            DropIndex("dbo.Views", new[] { "Renter_Id" });
            DropIndex("dbo.AspNetUserLogins", new[] { "UserId" });
            DropIndex("dbo.AspNetUserClaims", new[] { "UserId" });
            DropIndex("dbo.AspNetUsers", "UserNameIndex");
            DropIndex("dbo.AspNetUserRoles", new[] { "RoleId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "UserId" });
            DropIndex("dbo.AspNetRoles", "RoleNameIndex");
            DropIndex("dbo.Reports", new[] { "RoomRentalPost_Id" });
            DropIndex("dbo.Reports", new[] { "Renter_Id" });
            DropIndex("dbo.Likes", new[] { "RoomRentalPost_Id" });
            DropIndex("dbo.Likes", new[] { "Renter_Id" });
            DropIndex("dbo.RoomRentalPosts", new[] { "Accommodation_Id" });
            DropIndex("dbo.Comments", new[] { "RoomRentalPost_Id" });
            DropIndex("dbo.Comments", new[] { "Renter_Id" });
            DropIndex("dbo.Accommodations", new[] { "Owner_Id" });
            DropTable("dbo.Views");
            DropTable("dbo.AspNetUserLogins");
            DropTable("dbo.AspNetUserClaims");
            DropTable("dbo.AspNetUsers");
            DropTable("dbo.AspNetUserRoles");
            DropTable("dbo.AspNetRoles");
            DropTable("dbo.Reports");
            DropTable("dbo.Likes");
            DropTable("dbo.RoomRentalPosts");
            DropTable("dbo.Renters");
            DropTable("dbo.Comments");
            DropTable("dbo.Admins");
            DropTable("dbo.Owners");
            DropTable("dbo.Accommodations");
        }
    }
}