using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using ccnd.Interfaces;
using chatapp.Models;

namespace chatapp.Dtos.Message
{
    public class CreateMessageDto : ICreateDto
    {
        public string Content = String.Empty;
        public string Attachment = String.Empty;

        [Required(ErrorMessage = "Type is required")]
        public MessageType Type = MessageType.Text;

        [Required(ErrorMessage = "ChatGroupId is required")]
        public Guid ChatGroupId = Guid.Empty;

        [Required(ErrorMessage = "SenderId is required")]
        public Guid SenderId = Guid.Empty;

    }
}