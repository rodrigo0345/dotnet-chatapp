using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using ccnd.Interfaces;
using chatapp.Models;

namespace chatapp.Dtos.Message
{
    public class UpdateMessageDto : IUpdateDto
    {
        [Required(ErrorMessage = "Id is required")]
        public Guid Id = Guid.Empty;
        public string Content = String.Empty;
        public string Attachment = String.Empty;
        public MessageType Type = MessageType.Text;
    }
}