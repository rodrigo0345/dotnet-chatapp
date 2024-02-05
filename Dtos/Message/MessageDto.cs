using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using chatapp.Models;

namespace chatapp.Dtos.Message
{
    public class MessageDto
    {
        [Required]
        public Guid Id { get; set; }
        public string Content { get; set; } = String.Empty;
        public string Attachment { get; set; } = String.Empty;
        public DateTime CreatedOn { get; set; } = DateTime.Now;
        public MessageType Type { get; set; } = MessageType.Text;
        public Guid ChatGroupId { get; set; }

        [Required]
        public Guid SenderId { get; set; }
    }
}