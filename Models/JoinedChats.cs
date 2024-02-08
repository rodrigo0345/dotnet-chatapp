using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using ShoppingProject.Models;

namespace chatapp.Models
{
    [Table("JoinedChats")]
    public class JoinedChat
    {
        [Key]
        public Guid Id { get; set; }

        public string UserId { get; set; } = String.Empty;
        public AppUser User { get; set; } = null!;

        public Guid ChatGroupId { get; set; } = Guid.Empty;
        public ChatGroup ChatGroup { get; set; } = null!;

        public bool IsAccepted { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsBanned { get; set; }
    }
}