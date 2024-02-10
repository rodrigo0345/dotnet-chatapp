using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ShoppingProject.Migrations
{
    /// <inheritdoc />
    public partial class AddingCreatedOn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e9fbe2ce-71e2-407b-9973-a30e8ffbaa99");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "d3249fc1-0c71-43a7-b24b-65380d1c137f", "3de715d7-1d8b-42b7-b59b-4f1ef7488425" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d3249fc1-0c71-43a7-b24b-65380d1c137f");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "3de715d7-1d8b-42b7-b59b-4f1ef7488425");

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
                    { "d3249fc1-0c71-43a7-b24b-65380d1c137f", null, "Admin", "ADMIN" },
                    { "e9fbe2ce-71e2-407b-9973-a30e8ffbaa99", null, "User", "USER" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "Bio", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "3de715d7-1d8b-42b7-b59b-4f1ef7488425", 0, "I am the admin", "76b6127b-c8ef-4de7-9457-29566ae04c38", "admin@gmail.com", true, false, null, "ADMIN@GMAIL.COM", "ADMIN", "AQAAAAIAAYagAAAAEA+rH8AW+AejWm3pk755Zd4xcOUJ2e1WWg55/HbMqmg+iTuohXGgIvKtxUIaK0MDHA==", null, false, "e0017374-9b46-4459-9029-5adbc7463aa6", false, "admin" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "d3249fc1-0c71-43a7-b24b-65380d1c137f", "3de715d7-1d8b-42b7-b59b-4f1ef7488425" });
        }
    }
}
