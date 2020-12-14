namespace EasyAccomod.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class AddRentalPostStatus : DbMigration
    {
        public override void Up()
        {
            Sql(@"INSERT INTO [dbo].[RentalPostStatus] ([Name]) VALUES (N'Đang chỉnh sửa')
INSERT INTO [dbo].[RentalPostStatus] ([Name]) VALUES (N'Đang chờ quyền chỉnh sửa')
");
        }

        public override void Down()
        {
        }
    }
}