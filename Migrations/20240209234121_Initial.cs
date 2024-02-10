using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ShoppingProject.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8ae562fa-6dd5-45fa-adc2-396e7241845f");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "94d9820c-21b8-4382-b739-f2179e99e1cc", "cdbd8300-c873-455b-9bbd-5243b4349be4" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "94d9820c-21b8-4382-b739-f2179e99e1cc");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "cdbd8300-c873-455b-9bbd-5243b4349be4");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
                    { "8ae562fa-6dd5-45fa-adc2-396e7241845f", null, "User", "USER" },
                    { "94d9820c-21b8-4382-b739-f2179e99e1cc", null, "Admin", "ADMIN" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "Bio", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "cdbd8300-c873-455b-9bbd-5243b4349be4", 0, "I am the admin", "348e89f8-4a97-48c3-9fd8-add7d04385db", "admin@gmail.com", true, false, null, "ADMIN@GMAIL.COM", "ADMIN", "AQAAAAIAAYagAAAAEP2v/k9+lx+i1y/E+X5S+6U6meZEw8Sqp++B+OGQvRrqGvZFLJCfcuC3wv+K2035Cw==", null, false, "5cd978fd-e2e6-4592-a23f-d0cb9a50b78b", false, "admin" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "94d9820c-21b8-4382-b739-f2179e99e1cc", "cdbd8300-c873-455b-9bbd-5243b4349be4" });
        }
    }
}
