namespace EasyAccomod.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class AddDemoRecordToDb : DbMigration
    {
        public override void Up()
        {
            Sql(@"INSERT INTO [dbo].[AspNetUsers] ([Id], [Email], [EmailConfirmed], [PasswordHash], [SecurityStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEndDateUtc], [LockoutEnabled], [AccessFailedCount], [UserName]) VALUES (N'14bd48bd-5500-4081-aa22-35f92d2f0282', N'renter1@gmail.com', 0, N'AODGncaf5XPMfLU3L3a2PLCUgTYI84qAQkwjLhpLS+YbRB0DX6feouAtM3gbzh2mMQ==', N'ed30a331-018c-4c1e-8bfe-43389e43d3f6', NULL, 0, 0, NULL, 0, 0, N'Renter1')
INSERT INTO [dbo].[AspNetUsers] ([Id], [Email], [EmailConfirmed], [PasswordHash], [SecurityStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEndDateUtc], [LockoutEnabled], [AccessFailedCount], [UserName]) VALUES (N'2ab0ac1b-9c76-4566-8173-51dcb05adc39', N'owner2@gmail.com', 0, N'ANsNWQKcYa0w+lgqO6w/ovgCtG7Xt8TtgENd4zcKtHz1FOMw8EZ0qImbcW8GrsmGyg==', N'2bad4bca-145c-4873-b76b-129472155bbb', NULL, 0, 0, NULL, 0, 0, N'Owner2')
INSERT INTO [dbo].[AspNetUsers] ([Id], [Email], [EmailConfirmed], [PasswordHash], [SecurityStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEndDateUtc], [LockoutEnabled], [AccessFailedCount], [UserName]) VALUES (N'50755319-711e-4cde-935c-75a2bf98a306', N'renter2@gmail.com', 0, N'AFM9ppqrgrEbBLFSpUtCR4VdvdQvF5Xt56rA0PRbC41T2/LzVM4naN+QSDxwfBfD5A==', N'539cef93-3315-4681-8947-27850f34d929', NULL, 0, 0, NULL, 0, 0, N'Renter2')
INSERT INTO [dbo].[AspNetUsers] ([Id], [Email], [EmailConfirmed], [PasswordHash], [SecurityStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEndDateUtc], [LockoutEnabled], [AccessFailedCount], [UserName]) VALUES (N'6c9abf68-d512-48a2-bd90-340c5e4d7713', N'owner1@gmail.com', 0, N'AFQsZG76W/a4d5C7/CcKQ/WXZOP3wHYI1NdsX4zRZC2e7ZrJ4FvmvgDe8qzQtME8jQ==', N'301ca47f-951d-410b-9567-af97b83b3e92', NULL, 0, 0, NULL, 0, 0, N'Owner1')

SET IDENTITY_INSERT [dbo].[Owners] ON
INSERT INTO [dbo].[Owners] ([Id], [Name], [Identification], [Address], [Phone], [Email], [AccountId]) VALUES (1, N'Owner 1', N'123456789', N'Ha Noi', N'Owner 1', N'owner1@gmail.com', N'6c9abf68-d512-48a2-bd90-340c5e4d7713')
INSERT INTO [dbo].[Owners] ([Id], [Name], [Identification], [Address], [Phone], [Email], [AccountId]) VALUES (2, N'Owner 2', N'123456789', N'Ha Noi', N'Owner 2', N'owner2@gmail.com', N'2ab0ac1b-9c76-4566-8173-51dcb05adc39')
SET IDENTITY_INSERT [dbo].[Owners] OFF

SET IDENTITY_INSERT [dbo].[Renters] ON
INSERT INTO [dbo].[Renters] ([Id], [Name], [Email], [AccountId]) VALUES (3, N'Renter 1', N'renter1@gmail.com', N'14bd48bd-5500-4081-aa22-35f92d2f0282')
INSERT INTO [dbo].[Renters] ([Id], [Name], [Email], [AccountId]) VALUES (4, N'Renter 2', N'renter2@gmail.com', N'50755319-711e-4cde-935c-75a2bf98a306')
SET IDENTITY_INSERT [dbo].[Renters] OFF

INSERT INTO [dbo].[AspNetUserRoles] ([UserId], [RoleId]) VALUES (N'2ab0ac1b-9c76-4566-8173-51dcb05adc39', N'a22b9449-fffb-42e5-bac0-4dcf44dc0ca3')
INSERT INTO [dbo].[AspNetUserRoles] ([UserId], [RoleId]) VALUES (N'6c9abf68-d512-48a2-bd90-340c5e4d7713', N'a22b9449-fffb-42e5-bac0-4dcf44dc0ca3')
");
        }

        public override void Down()
        {
        }
    }
}