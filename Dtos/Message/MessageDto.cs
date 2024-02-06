using System.ComponentModel.DataAnnotations;
using chatapp.Models;

namespace chatapp.Dtos.Message
{
    public class MessageDto
    {
        [Required]
        public Guid Id { get; set; } = Guid.Empty;
        [Required]
        public Guid SenderId { get; set; } = Guid.Empty;
        public string Content { get; set; } = String.Empty;
        public string Attachment { get; set; } = String.Empty;
        public DateTime CreatedOn { get; set; } = DateTime.Now;
        public MessageType Type { get; set; } = MessageType.Text;
        public Guid ChatGroupId { get; set; }

    }
}