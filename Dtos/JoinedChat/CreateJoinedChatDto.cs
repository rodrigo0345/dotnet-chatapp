using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using ccnd.Interfaces;
using chatapp.Models;

namespace chatapp.Dtos.Message
{
    public class CreateJoinedChatDto
    {
        [Required]
        public Guid ChatGroupId { get; set; } = Guid.NewGuid();
        public string? UserId { get; set; } = null;
        public bool IsAccepted { get; set; } = true;
        public bool IsAdmin { get; set; } = true;
        public bool IsBanned { get; set; } = false;
    }
}