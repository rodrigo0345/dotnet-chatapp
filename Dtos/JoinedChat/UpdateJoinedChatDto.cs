using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using ccnd.Interfaces;
using chatapp.Models;

namespace chatapp.Dtos.Message
{
    public class UpdateJoinedChatDto
    {
        [Required]
        public Guid Id { get; set; } = Guid.NewGuid();
        public bool IsAccepted { get; set; } = true;
        public bool IsAdmin { get; set; } = true;
        public bool IsBanned { get; set; } = false;
    }
}