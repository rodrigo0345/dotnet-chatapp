using System.ComponentModel.DataAnnotations;

namespace ShoppingProject.Dtos.JoinedChat
{
    public class InviteToChatDto
    {
        [Required]
        public Guid ChatGroupId { get; set; } = Guid.Empty;

        [Required]
        [MinLength(2)]
        [MaxLength(255)]
        public string UserName { get; set; } = String.Empty;
    }
}
