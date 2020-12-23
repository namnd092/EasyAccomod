namespace EasyAccomod.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class AddEditInfoRequestModel : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.EditInfoRequests",
                c => new
                {
                    Id = c.Int(nullable: false, identity: true),
                    OwnerId = c.Int(nullable: false),
                    CanEditInfo = c.Boolean(nullable: false),
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Owners", t => t.OwnerId, cascadeDelete: true)
                .Index(t => t.OwnerId);
        }

        public override void Down()
        {
            DropForeignKey("dbo.EditInfoRequests", "OwnerId", "dbo.Owners");
            DropIndex("dbo.EditInfoRequests", new[] { "OwnerId" });
            DropTable("dbo.EditInfoRequests");
        }
    }
}