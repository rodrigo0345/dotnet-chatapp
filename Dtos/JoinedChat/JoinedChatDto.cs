using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using chatapp.Models;

namespace chatapp.Dtos.Message
{
    public class JoinedChatDto
    {
        [Required]
        public Guid Id { get; set; } = Guid.Empty;

        [Required]
        public ChatGroup ChatGroup { get; set; } = null!;

        public bool IsAccepted { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsBanned { get; set; }
        public string UserId { get; set; } = String.Empty;
    }
}