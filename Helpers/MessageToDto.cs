using chatapp.Dtos.Message;
using chatapp.Models;

namespace ShoppingProject.Helpers
{
    public static class MessageToDto
    {
        public static MessageDto? ToDto(this Message message)
        {
            if(message == null)
            {
                return null;
            }
            return new MessageDto
            {
                Id = message.Id,
                Content = message.Content,
                Attachment = message.Attachment,
                SenderId = message.SenderId,
                ChatGroupId = message.ChatGroupId,
                CreatedOn = message.CreatedOn,
            };
        }
    }
}
