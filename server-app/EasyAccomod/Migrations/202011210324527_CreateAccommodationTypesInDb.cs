namespace EasyAccomod.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class CreateAccommodationTypesInDb : DbMigration
    {
        public override void Up()
        {
            Sql(@"INSERT INTO [dbo].[AccommodationTypes] ([Name]) VALUES (N'Phòng trọ')
INSERT INTO [dbo].[AccommodationTypes] ([Name]) VALUES (N'Chung cư mini')
INSERT INTO [dbo].[AccommodationTypes] ([Name]) VALUES (N'Nhà nguyên căn')
INSERT INTO [dbo].[AccommodationTypes] ([Name]) VALUES (N'Chung cư nguyên căn')
");
        }

        public override void Down()
        {
        }
    }
}