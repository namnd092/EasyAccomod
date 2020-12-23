namespace EasyAccomod.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class AddNotificationModel : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Notifications",
                c => new
                {
                    Id = c.Int(nullable: false, identity: true),
                    AccountId = c.String(nullable: false),
                    Content = c.String(nullable: false),
                    RentalPostId = c.Int(nullable: false),
                    Time = c.DateTime(nullable: false),
                    HasBeenChecked = c.Boolean(nullable: false),
                })
                .PrimaryKey(t => t.Id);
        }

        public override void Down()
        {
            DropTable("dbo.Notifications");
        }
    }
}