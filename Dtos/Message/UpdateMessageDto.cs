using System.ComponentModel.DataAnnotations;
using chatapp.Models;

namespace chatapp.Dtos.Message
{
    public class UpdateMessageDto
    {
        [Required]
        public Guid Id { get; set; } = Guid.Empty;

        [Required]
        [MinLength(3)]
        [MaxLength(500)]
        public string Content { get; set; } = String.Empty;

        [Required]
        [MinLength(3)]
        [MaxLength(500)]
        public string Attachment { get; set; } = String.Empty;

        [Required]
        [MinLength(3)]
        [MaxLength(500)]
        public string Type { get; set; } = MessageType.Text.ToString();
    }
}