using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ShoppingProject.Migrations
{
    /// <inheritdoc />
    public partial class UsersLogos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e2f2bd42-12d9-41c0-a18b-9602d58c6c5d");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "bc30bfd0-bd03-4b7e-87cf-ab87f7ec25bf", "d841a1b7-acc8-445a-8f09-b5203a2ad657" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "bc30bfd0-bd03-4b7e-87cf-ab87f7ec25bf");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "d841a1b7-acc8-445a-8f09-b5203a2ad657");

            migrationBuilder.AddColumn<string>(
                name: "Logo",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropColumn(
                name: "Logo",
                table: "AspNetUsers");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "bc30bfd0-bd03-4b7e-87cf-ab87f7ec25bf", null, "Admin", "ADMIN" },
                    { "e2f2bd42-12d9-41c0-a18b-9602d58c6c5d", null, "User", "USER" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "Bio", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "d841a1b7-acc8-445a-8f09-b5203a2ad657", 0, "I am the admin", "002d795e-9863-43be-8ea3-daff5138ab01", "admin@gmail.com", true, false, null, "ADMIN@GMAIL.COM", "ADMIN", "AQAAAAIAAYagAAAAEMW13Nboyb9OlBORNyGeU/aNeQVSyOx1c5QN3VYab/4o4Jb7ojBzfKrf5UB4ldi6tQ==", null, false, "7a00c273-e078-44d5-811e-f9f26f43a67a", false, "admin" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "bc30bfd0-bd03-4b7e-87cf-ab87f7ec25bf", "d841a1b7-acc8-445a-8f09-b5203a2ad657" });
        }
    }
}
