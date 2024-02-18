using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Threading.Tasks;
using chatapp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ShoppingProject.Models;

namespace ShoppingProject.Data
{

    public enum Role
    {
        Admin,
        User
    }
    public class AplicationDbContext : IdentityDbContext<AppUser>
    {
        public AplicationDbContext(DbContextOptions<AplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Message> Messages { get; set; }
        public DbSet<ChatGroup> ChatGroups { get; set; }
        public DbSet<JoinedChat> JoinedChats { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {

            builder.Entity<JoinedChat>()
            .HasIndex(p => new { p.ChatGroupId, p.UserId})
            .IsUnique(true);

            builder.Entity<JoinedChat>()
                .HasOne(p => p.User)
                .WithMany(p => p.JoinedChats)
                .HasForeignKey(p => p.UserId);

            base.OnModelCreating(builder);
            List<IdentityRole> roles = [
                new IdentityRole { Name = Role.Admin.ToString(), NormalizedName = "ADMIN" },
                new IdentityRole { Name = Role.User.ToString(), NormalizedName = "USER" }
            ];

            builder.Entity<IdentityRole>().HasData(roles);

            AppUser admin = new AppUser
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "admin",
                Email = "admin@gmail.com",
                EmailConfirmed = true,
                NormalizedEmail = "ADMIN@GMAIL.COM",
                NormalizedUserName = "ADMIN",
                SecurityStamp = Guid.NewGuid().ToString(),
                Bio = "I am the admin",
                PasswordHash = new PasswordHasher<AppUser>().HashPassword(null, "admin"),
            };

            // Add admin role
            builder.Entity<IdentityUserRole<string>>().HasData(new IdentityUserRole<string>
            {
                RoleId = roles[0].Id,
                UserId = admin.Id
            });

            builder.Entity<AppUser>().HasData(admin);
        }

    }
}