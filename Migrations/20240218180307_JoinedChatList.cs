using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ShoppingProject.Migrations
{
    /// <inheritdoc />
    public partial class JoinedChatList : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "96182a59-4361-47f9-8c08-5fff13db0e3b");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "3064e9c2-7fc2-4cc7-9a40-6e8e1f01d279", "bd87685f-93d9-40a9-9777-957377dec0a2" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3064e9c2-7fc2-4cc7-9a40-6e8e1f01d279");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "bd87685f-93d9-40a9-9777-957377dec0a2");

            migrationBuilder.AddColumn<string>(
                name: "AppUserId",
                table: "JoinedChats",
                type: "text",
                nullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "662b3305-6579-4200-8137-8ff756abf10d", null, "User", "USER" },
                    { "e3e22136-31e9-4ba4-9e0c-117103c1f212", null, "Admin", "ADMIN" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "Bio", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "Logo", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "1f9aa107-2d07-49b1-a29a-90904d27cf12", 0, "I am the admin", "c3748105-6179-4381-b6af-17b959c0724d", "admin@gmail.com", true, false, null, "", "ADMIN@GMAIL.COM", "ADMIN", "AQAAAAIAAYagAAAAEEYpfmnplYZHtB1Fgc2tXxVUKDuJUmZU50IbWgPSvDwSuh91x5ivO8/W7zSSQp3WRA==", null, false, "dc27438e-34d6-45e0-bea7-db98a7f8d2e8", false, "admin" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "e3e22136-31e9-4ba4-9e0c-117103c1f212", "1f9aa107-2d07-49b1-a29a-90904d27cf12" });

            migrationBuilder.CreateIndex(
                name: "IX_JoinedChats_AppUserId",
                table: "JoinedChats",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_JoinedChats_AspNetUsers_AppUserId",
                table: "JoinedChats",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JoinedChats_AspNetUsers_AppUserId",
                table: "JoinedChats");

            migrationBuilder.DropIndex(
                name: "IX_JoinedChats_AppUserId",
                table: "JoinedChats");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "662b3305-6579-4200-8137-8ff756abf10d");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "e3e22136-31e9-4ba4-9e0c-117103c1f212", "1f9aa107-2d07-49b1-a29a-90904d27cf12" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e3e22136-31e9-4ba4-9e0c-117103c1f212");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1f9aa107-2d07-49b1-a29a-90904d27cf12");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "JoinedChats");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "3064e9c2-7fc2-4cc7-9a40-6e8e1f01d279", null, "Admin", "ADMIN" },
                    { "96182a59-4361-47f9-8c08-5fff13db0e3b", null, "User", "USER" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "Bio", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "Logo", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "bd87685f-93d9-40a9-9777-957377dec0a2", 0, "I am the admin", "d014ee25-1c88-4083-8316-015eba3ab97f", "admin@gmail.com", true, false, null, "", "ADMIN@GMAIL.COM", "ADMIN", "AQAAAAIAAYagAAAAEOhEu70JDZMcUdQl1RA4XB2FQTXd7V1KA2SYrZ7n/M/zn8Catc40T7QxRQc5jISP6g==", null, false, "fa047fd1-ae04-40da-90ba-17c13be8cdb6", false, "admin" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "3064e9c2-7fc2-4cc7-9a40-6e8e1f01d279", "bd87685f-93d9-40a9-9777-957377dec0a2" });
        }
    }
}
