using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

        public DbSet<ShoppingProject.Models.Stock> Stock { get; set; }
        public DbSet<ShoppingProject.Models.Comment> Comment { get; set; }
        public DbSet<ShoppingProject.Models.Portfolio> Portfolio { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Portfolio>(x => x.HasKey(y => new { y.AppUserId, y.StockId }));

            builder.Entity<Portfolio>().HasOne(u => u.AppUser).WithMany(p => p.Portfolios).HasForeignKey(u => u.AppUserId);
            builder.Entity<Portfolio>().HasOne(u => u.Stock).WithMany(p => p.Portfolios).HasForeignKey(u => u.StockId);

            base.OnModelCreating(builder);
            List<IdentityRole> roles = new List<IdentityRole>{
                new IdentityRole { Name = Role.Admin.ToString(), NormalizedName = "ADMIN" },
                new IdentityRole { Name = Role.User.ToString(), NormalizedName = "USER" }
            };

            builder.Entity<IdentityRole>().HasData(roles);
        }

    }
}