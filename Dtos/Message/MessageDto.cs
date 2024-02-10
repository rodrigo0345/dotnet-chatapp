using System.ComponentModel.DataAnnotations;
using chatapp.Models;
using ShoppingProject.Dtos.User;
using ShoppingProject.Models;

namespace chatapp.Dtos.Message
{
    public class MessageDto
    {
        [Required]
        public Guid Id { get; set; } = Guid.Empty;
        [Required]
        public string SenderId { get; set; } = String.Empty;
        public UserDto Sender { get; set; } = null!;
        public string Content { get; set; } = String.Empty;
        public string Attachment { get; set; } = String.Empty;
        public DateTime CreatedOn { get; set; } = DateTime.Now;
        public MessageType Type { get; set; } = MessageType.Text;
        public Guid ChatGroupId { get; set; }

    }
}