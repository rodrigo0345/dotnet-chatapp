using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingProject.Dtos.User
{
    public class RegisterDto
    {
        [Required]
        public string? Username { get; set; } = null;

        [Required]
        [EmailAddress]
        public string? Email { get; set; } = null;

        [Required]
        [StringLength(100, MinimumLength = 4)]
        public string? Password { get; set; } = null;

        public string Bio { get; set; } = String.Empty;
    }
}