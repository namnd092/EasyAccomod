namespace EasyAccomod.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class EditReportModel : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Reports", "IsSolved", c => c.Boolean(nullable: false));
            DropColumn("dbo.Reports", "Status");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Reports", "Status", c => c.String());
            DropColumn("dbo.Reports", "IsSolved");
        }
    }
}
