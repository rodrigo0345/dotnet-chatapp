using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingProject.Dtos.User
{
    public class UpdateUserDto
    {
        public string Id { get; set; } = String.Empty;

        [Required]
        public string Username { get; set; } = null!;

        [Required]
        public string Email { get; set; } = null!;

        [Required]
        public string Bio { get; set; } = null!;
    }
}