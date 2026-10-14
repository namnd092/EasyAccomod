using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EasyAccomod.Api.Migrations
{
    /// <inheritdoc />
    public partial class TrackViewerOnViews : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Views_AccommodationRentalPostId",
                table: "Views");

            migrationBuilder.AddColumn<string>(
                name: "ViewerKey",
                table: "Views",
                type: "character varying(64)",
                maxLength: 64,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Views_AccommodationRentalPostId_ViewerKey_Time",
                table: "Views",
                columns: new[] { "AccommodationRentalPostId", "ViewerKey", "Time" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Views_AccommodationRentalPostId_ViewerKey_Time",
                table: "Views");

            migrationBuilder.DropColumn(
                name: "ViewerKey",
                table: "Views");

            migrationBuilder.CreateIndex(
                name: "IX_Views_AccommodationRentalPostId",
                table: "Views",
                column: "AccommodationRentalPostId");
        }
    }
}
