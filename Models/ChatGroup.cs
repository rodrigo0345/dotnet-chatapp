using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using ShoppingProject.Models;

namespace chatapp.Models
{
    [Table("ChatGroups")]
    public class ChatGroup
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = String.Empty;
        public string Logo { get; set; } = String.Empty;

        public string UserId { get; set; } = String.Empty;
        public AppUser User { get; set; } = null!;
    }
}