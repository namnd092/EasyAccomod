namespace EasyAccomod.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class EditCommentModel : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Comments", "Rate", c => c.Byte(nullable: false));
            AddColumn("dbo.Comments", "IsApproved", c => c.Boolean(nullable: false));
            DropColumn("dbo.Comments", "Status");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Comments", "Status", c => c.String());
            DropColumn("dbo.Comments", "IsApproved");
            DropColumn("dbo.Comments", "Rate");
        }
    }
}
