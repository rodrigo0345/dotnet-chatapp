using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ShoppingProject.Migrations
{
    /// <inheritdoc />
    public partial class UniqueRestriction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_JoinedChats_ChatGroupId",
                table: "JoinedChats");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c55ce138-0614-4612-a8a8-2106e2ee49af");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "4b303157-b299-4965-9dce-5fa836754bcf", "8499de37-0c18-46a8-a1d6-556c4ba7e8d5" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "4b303157-b299-4965-9dce-5fa836754bcf");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "8499de37-0c18-46a8-a1d6-556c4ba7e8d5");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "a20bca6d-fb99-4f7b-a101-05cd8c055383", null, "Admin", "ADMIN" },
                    { "ab9f5cdc-fe99-4f42-bc22-bb6e38690024", null, "User", "USER" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "Bio", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "8693e2cb-c9be-4360-98f5-a3950cc104a6", 0, "I am the admin", "826c738a-4bc4-48d8-a0fa-7e3e97f4ede2", "admin@gmail.com", true, false, null, "ADMIN@GMAIL.COM", "ADMIN", "AQAAAAIAAYagAAAAEDWxdcbUgfHDEnsBsm68ZP2BwOWLJZLwCsGi/BR3ioB516dd82Bdz2RR41ql5uT0Lg==", null, false, "27cea369-bb80-443a-b25d-72494272c641", false, "admin" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "a20bca6d-fb99-4f7b-a101-05cd8c055383", "8693e2cb-c9be-4360-98f5-a3950cc104a6" });

            migrationBuilder.CreateIndex(
                name: "IX_JoinedChats_ChatGroupId_UserId",
                table: "JoinedChats",
                columns: new[] { "ChatGroupId", "UserId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_JoinedChats_ChatGroupId_UserId",
                table: "JoinedChats");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ab9f5cdc-fe99-4f42-bc22-bb6e38690024");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "a20bca6d-fb99-4f7b-a101-05cd8c055383", "8693e2cb-c9be-4360-98f5-a3950cc104a6" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a20bca6d-fb99-4f7b-a101-05cd8c055383");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "8693e2cb-c9be-4360-98f5-a3950cc104a6");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "4b303157-b299-4965-9dce-5fa836754bcf", null, "Admin", "ADMIN" },
                    { "c55ce138-0614-4612-a8a8-2106e2ee49af", null, "User", "USER" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "Bio", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "8499de37-0c18-46a8-a1d6-556c4ba7e8d5", 0, "I am the admin", "588ec5fe-1e54-47d3-9903-e470a77bac62", "admin@gmail.com", true, false, null, "ADMIN@GMAIL.COM", "ADMIN", "AQAAAAIAAYagAAAAEOoYcSIE9L6f2Li0egNGy4b61dZqz4M/Ynso6K1fCTl+G2pKdNfnjGFZh6lyeN1z9A==", null, false, "274bc3b6-4d7b-4fda-86b7-5c11eeed4bf5", false, "admin" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "4b303157-b299-4965-9dce-5fa836754bcf", "8499de37-0c18-46a8-a1d6-556c4ba7e8d5" });

            migrationBuilder.CreateIndex(
                name: "IX_JoinedChats_ChatGroupId",
                table: "JoinedChats",
                column: "ChatGroupId");
        }
    }
}
