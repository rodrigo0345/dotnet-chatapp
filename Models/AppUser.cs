using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace ShoppingProject.Models
{
    public class AppUser : IdentityUser
    {
        public string Bio { get; set; } = String.Empty;

        public List<Portfolio> Portfolios { get; set; } = new List<Portfolio>();

    }
}