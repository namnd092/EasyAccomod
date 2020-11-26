namespace EasyAccomod.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class AddAccommodationStatusModel : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.AccommodationStatus",
                c => new
                {
                    Id = c.Byte(nullable: false, identity: true),
                    Name = c.String(nullable: false),
                })
                .PrimaryKey(t => t.Id);

            AddColumn("dbo.Accommodations", "StatusId", c => c.Byte(nullable: false));
            CreateIndex("dbo.Accommodations", "StatusId");
            AddForeignKey("dbo.Accommodations", "StatusId", "dbo.AccommodationStatus", "Id", cascadeDelete: true);
            DropColumn("dbo.Accommodations", "Status");

            Sql(@"INSERT INTO [dbo].[AccommodationStatus] ([Name]) VALUES (N'Chưa cho thuê')
INSERT INTO [dbo].[AccommodationStatus] ([Name]) VALUES (N'Đã cho thuê')
");
        }

        public override void Down()
        {
            AddColumn("dbo.Accommodations", "Status", c => c.String(nullable: false));
            DropForeignKey("dbo.Accommodations", "StatusId", "dbo.AccommodationStatus");
            DropIndex("dbo.Accommodations", new[] { "StatusId" });
            DropColumn("dbo.Accommodations", "StatusId");
            DropTable("dbo.AccommodationStatus");
        }
    }
}