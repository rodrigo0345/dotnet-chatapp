using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using ShoppingProject.Models;

namespace chatapp.Models
{
    public enum MessageType
    {
        Text,
        Image,
        Video,
        Audio,
        File,
        PDF
    }
    [Table("Messages")]
    public class Message
    {
        [Key]
        public Guid Id { get; set; }
        public string Content { get; set; } = String.Empty;
        public string Attachment { get; set; } = String.Empty;
        public MessageType Type { get; set; } = MessageType.Text;

        public DateTime CreatedOn { get; set; } 

        public Guid ChatGroupId { get; set; }
        public ChatGroup ChatGroup { get; set; } = null!;

        public string SenderId { get; set; } = String.Empty;
        public AppUser Sender { get; set; } = null!;
    }
}