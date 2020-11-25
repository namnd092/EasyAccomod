namespace EasyAccomod.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class EditAddressModel : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Addresses", "District_Id", "dbo.Districts");
            DropForeignKey("dbo.Addresses", "Province_Id", "dbo.Provinces");
            DropForeignKey("dbo.Addresses", "Ward_Id", "dbo.Wards");

            DropIndex("dbo.Addresses", new[] { "District_Id" });
            DropIndex("dbo.Addresses", new[] { "Province_Id" });
            DropIndex("dbo.Addresses", new[] { "Ward_Id" });

            RenameColumn(table: "dbo.Addresses", name: "District_Id", newName: "DistrictId");
            RenameColumn(table: "dbo.Addresses", name: "Province_Id", newName: "ProvinceId");
            RenameColumn(table: "dbo.Addresses", name: "Ward_Id", newName: "WardId");

            RenameColumn(table: "dbo.Districts", name: "Province_Id", newName: "ProvinceId");
            RenameColumn(table: "dbo.Wards", name: "District_Id", newName: "DistrictId");

            RenameIndex(table: "dbo.Districts", name: "IX_Province_Id", newName: "IX_ProvinceId");
            RenameIndex(table: "dbo.Wards", name: "IX_District_Id", newName: "IX_DistrictId");

            AlterColumn("dbo.Addresses", "DistrictId", c => c.Int(nullable: false));
            AlterColumn("dbo.Addresses", "ProvinceId", c => c.Byte(nullable: false));
            AlterColumn("dbo.Addresses", "WardId", c => c.Int(nullable: false));

            CreateIndex("dbo.Addresses", "ProvinceId");
            CreateIndex("dbo.Addresses", "DistrictId");
            CreateIndex("dbo.Addresses", "WardId");

            AddForeignKey("dbo.Addresses", "DistrictId", "dbo.Districts", "Id");
            AddForeignKey("dbo.Addresses", "ProvinceId", "dbo.Provinces", "Id");
            AddForeignKey("dbo.Addresses", "WardId", "dbo.Wards", "Id", cascadeDelete: true);
        }

        public override void Down()
        {
            DropForeignKey("dbo.Addresses", "WardId", "dbo.Wards");
            DropForeignKey("dbo.Addresses", "ProvinceId", "dbo.Provinces");
            DropForeignKey("dbo.Addresses", "DistrictId", "dbo.Districts");
            DropIndex("dbo.Addresses", new[] { "WardId" });
            DropIndex("dbo.Addresses", new[] { "DistrictId" });
            DropIndex("dbo.Addresses", new[] { "ProvinceId" });
            AlterColumn("dbo.Addresses", "WardId", c => c.Int());
            AlterColumn("dbo.Addresses", "ProvinceId", c => c.Byte());
            AlterColumn("dbo.Addresses", "DistrictId", c => c.Int());
            RenameIndex(table: "dbo.Wards", name: "IX_DistrictId", newName: "IX_District_Id");
            RenameIndex(table: "dbo.Districts", name: "IX_ProvinceId", newName: "IX_Province_Id");
            RenameColumn(table: "dbo.Wards", name: "DistrictId", newName: "District_Id");
            RenameColumn(table: "dbo.Districts", name: "ProvinceId", newName: "Province_Id");
            RenameColumn(table: "dbo.Addresses", name: "WardId", newName: "Ward_Id");
            RenameColumn(table: "dbo.Addresses", name: "ProvinceId", newName: "Province_Id");
            RenameColumn(table: "dbo.Addresses", name: "DistrictId", newName: "District_Id");
            CreateIndex("dbo.Addresses", "Ward_Id");
            CreateIndex("dbo.Addresses", "Province_Id");
            CreateIndex("dbo.Addresses", "District_Id");
            AddForeignKey("dbo.Addresses", "Ward_Id", "dbo.Wards", "Id");
            AddForeignKey("dbo.Addresses", "Province_Id", "dbo.Provinces", "Id");
            AddForeignKey("dbo.Addresses", "District_Id", "dbo.Districts", "Id");
        }
    }
}