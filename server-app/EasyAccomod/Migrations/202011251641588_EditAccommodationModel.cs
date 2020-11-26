namespace EasyAccomod.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class EditAccommodationModel : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Addresses", "Accommodation_Id", "dbo.Accommodations");
            DropIndex("dbo.Addresses", new[] { "Accommodation_Id" });

            RenameColumn(table: "dbo.Accommodations", name: "AccommodationType_Id", newName: "AccommodationTypeId");
            RenameColumn(table: "dbo.Accommodations", name: "Owner_Id", newName: "OwnerId");

            RenameIndex(table: "dbo.Accommodations", name: "IX_AccommodationType_Id", newName: "IX_AccommodationTypeId");
            RenameIndex(table: "dbo.Accommodations", name: "IX_Owner_Id", newName: "IX_OwnerId");

            CreateTable(
                "dbo.AccommodationPaymentTypes",
                c => new
                {
                    Id = c.Byte(nullable: false, identity: true),
                    Name = c.String(nullable: false),
                })
                .PrimaryKey(t => t.Id);

            CreateTable(
                "dbo.KitchenTypes",
                c => new
                {
                    Id = c.Byte(nullable: false, identity: true),
                    Name = c.String(nullable: false),
                })
                .PrimaryKey(t => t.Id);

            CreateTable(
                "dbo.RoomAreaRanges",
                c => new
                {
                    Id = c.Byte(nullable: false, identity: true),
                    Range = c.String(nullable: false),
                })
                .PrimaryKey(t => t.Id);

            AddColumn("dbo.Accommodations", "AddressId", c => c.Int(nullable: false));
            AddColumn("dbo.Accommodations", "PaymentTypeId", c => c.Byte());
            AddColumn("dbo.Accommodations", "Price", c => c.String());
            AddColumn("dbo.Accommodations", "RoomAreaRangeId", c => c.Byte());
            AddColumn("dbo.Accommodations", "KitchenTypeId", c => c.Byte(nullable: false));

            AddColumn("dbo.Addresses", "PublicLocationNearby", c => c.String());

            AlterColumn("dbo.Addresses", "Street", c => c.String(nullable: false));

            CreateIndex("dbo.Accommodations", "AddressId");
            CreateIndex("dbo.Accommodations", "PaymentTypeId");
            CreateIndex("dbo.Accommodations", "RoomAreaRangeId");
            CreateIndex("dbo.Accommodations", "KitchenTypeId");

            AddForeignKey("dbo.Accommodations", "AddressId", "dbo.Addresses", "Id", cascadeDelete: true);
            AddForeignKey("dbo.Accommodations", "KitchenTypeId", "dbo.KitchenTypes", "Id", cascadeDelete: true);
            AddForeignKey("dbo.Accommodations", "PaymentTypeId", "dbo.AccommodationPaymentTypes", "Id");
            AddForeignKey("dbo.Accommodations", "RoomAreaRangeId", "dbo.RoomAreaRanges", "Id");

            DropColumn("dbo.Accommodations", "RoomPrice");
            DropColumn("dbo.Accommodations", "RoomArea");
            DropColumn("dbo.Accommodations", "Kitchen");

            DropColumn("dbo.Addresses", "Accommodation_Id");

            Sql(@"INSERT INTO [dbo].[KitchenTypes] ([Name]) VALUES (N'Khu bếp riêng')
INSERT INTO [dbo].[KitchenTypes] ([Name]) VALUES (N'Khu bếp chung')
INSERT INTO [dbo].[KitchenTypes] ([Name]) VALUES (N'Không nấu ăn')
");

            Sql(@"INSERT INTO [dbo].[RoomAreaRanges] ([Range]) VALUES (N'10-20m2')
INSERT INTO [dbo].[RoomAreaRanges] ([Range]) VALUES (N'20-30m2')
INSERT INTO [dbo].[RoomAreaRanges] ([Range]) VALUES (N'30-40m2')
INSERT INTO [dbo].[RoomAreaRanges] ([Range]) VALUES (N'>40m2')
");

            Sql(@"INSERT INTO [dbo].[AccommodationPaymentTypes] ([Name]) VALUES (N'Tháng')
INSERT INTO [dbo].[AccommodationPaymentTypes] ([Name]) VALUES (N'Quý')
INSERT INTO [dbo].[AccommodationPaymentTypes] ([Name]) VALUES (N'Năm')
");
        }

        public override void Down()
        {
            AddColumn("dbo.Addresses", "Accommodation_Id", c => c.Int(nullable: false));
            AddColumn("dbo.Accommodations", "Kitchen", c => c.String(nullable: false));
            AddColumn("dbo.Accommodations", "RoomArea", c => c.String());
            AddColumn("dbo.Accommodations", "RoomPrice", c => c.String());
            DropForeignKey("dbo.Accommodations", "RoomAreaRangeId", "dbo.RoomAreaRanges");
            DropForeignKey("dbo.Accommodations", "PaymentTypeId", "dbo.AccommodationPaymentTypes");
            DropForeignKey("dbo.Accommodations", "KitchenTypeId", "dbo.KitchenTypes");
            DropForeignKey("dbo.Accommodations", "AddressId", "dbo.Addresses");
            DropIndex("dbo.Accommodations", new[] { "KitchenTypeId" });
            DropIndex("dbo.Accommodations", new[] { "RoomAreaRangeId" });
            DropIndex("dbo.Accommodations", new[] { "PaymentTypeId" });
            DropIndex("dbo.Accommodations", new[] { "AddressId" });
            AlterColumn("dbo.Addresses", "Street", c => c.String());
            DropColumn("dbo.Addresses", "PublicLocationNearby");
            DropColumn("dbo.Accommodations", "KitchenTypeId");
            DropColumn("dbo.Accommodations", "RoomAreaRangeId");
            DropColumn("dbo.Accommodations", "Price");
            DropColumn("dbo.Accommodations", "PaymentTypeId");
            DropColumn("dbo.Accommodations", "AddressId");
            DropTable("dbo.RoomAreaRanges");
            DropTable("dbo.KitchenTypes");
            DropTable("dbo.AccommodationPaymentTypes");
            RenameIndex(table: "dbo.Accommodations", name: "IX_OwnerId", newName: "IX_Owner_Id");
            RenameIndex(table: "dbo.Accommodations", name: "IX_AccommodationTypeId", newName: "IX_AccommodationType_Id");
            RenameColumn(table: "dbo.Accommodations", name: "OwnerId", newName: "Owner_Id");
            RenameColumn(table: "dbo.Accommodations", name: "AccommodationTypeId", newName: "AccommodationType_Id");
            CreateIndex("dbo.Addresses", "Accommodation_Id");
            AddForeignKey("dbo.Addresses", "Accommodation_Id", "dbo.Accommodations", "Id", cascadeDelete: true);
        }
    }
}