namespace EasyAccomod.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class AddStatusPropertyToAccommodation : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.RentalPostStatus",
                c => new
                {
                    Id = c.Byte(nullable: false, identity: true),
                    Name = c.String(nullable: false),
                })
                .PrimaryKey(t => t.Id);

            AddColumn("dbo.AccommodationRentalPosts", "StatusId", c => c.Byte(nullable: false));
            CreateIndex("dbo.AccommodationRentalPosts", "StatusId");
            AddForeignKey("dbo.AccommodationRentalPosts", "StatusId", "dbo.RentalPostStatus", "Id", cascadeDelete: true);

            Sql(@"INSERT INTO [dbo].[RentalPostStatus] ([Name]) VALUES (N'Đang chờ duyệt')
INSERT INTO [dbo].[RentalPostStatus] ([Name]) VALUES (N'Được duyệt')
INSERT INTO [dbo].[RentalPostStatus] ([Name]) VALUES (N'Không được duyệt')
INSERT INTO [dbo].[RentalPostStatus] ([Name]) VALUES (N'Hết hạn')
");
        }

        public override void Down()
        {
            DropForeignKey("dbo.AccommodationRentalPosts", "StatusId", "dbo.RentalPostStatus");
            DropIndex("dbo.AccommodationRentalPosts", new[] { "StatusId" });
            DropColumn("dbo.AccommodationRentalPosts", "StatusId");
            DropTable("dbo.RentalPostStatus");
        }
    }
}