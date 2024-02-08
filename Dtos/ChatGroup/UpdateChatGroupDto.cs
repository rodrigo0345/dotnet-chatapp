using System.ComponentModel.DataAnnotations;

namespace chatapp.Dtos.Message
{
    public class UpdateChatGroupDto
    {
        [Required]
        public Guid Id { get; set; } = Guid.Empty;

        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string Name { get; set; } = String.Empty;

        [Required]
        [MinLength(3)]
        public string Logo { get; set; } = String.Empty;
    }
}