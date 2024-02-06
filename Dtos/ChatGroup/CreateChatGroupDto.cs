using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using ccnd.Interfaces;
using chatapp.Models;

namespace chatapp.Dtos.Message
{
    public class CreateChatGroupDto
    {
        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string Name { get; set; } = String.Empty;

        [Required]
        [MinLength(3)]
        public string Logo { get; set; } = String.Empty;

        public string OwnerId { get; set; } = String.Empty;

    }
}