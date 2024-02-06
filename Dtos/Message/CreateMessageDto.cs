using System.ComponentModel.DataAnnotations;
using chatapp.Models;

namespace chatapp.Dtos.Message
{
    public class CreateMessageDto
    {
        [Required(ErrorMessage = "ChatGroupId is required")]
        public Guid ChatGroupId { get; set; } = Guid.Empty;

        [Required(ErrorMessage = "SenderId is required")]
        public Guid SenderId { get; set; } = Guid.Empty;
        public string Content { get; set; } = String.Empty;
        public string Attachment { get; set; } = String.Empty;

        [Required(ErrorMessage = "Type is required")]
        public MessageType Type { get; set; } = MessageType.Text;
    }
}