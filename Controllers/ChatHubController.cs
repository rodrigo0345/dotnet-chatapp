using chatapp.Dtos.Message;
using chatapp.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace ShoppingProject.Controllers
{

    // Not safe for sure, need to add authentication
    public class ChatHubController: Hub 
    {
        private readonly MessageRepository _messageRepository;
        public ChatHubController( MessageRepository messageRepository)
        {
            _messageRepository = messageRepository;
        }
        public async Task JoinChat(string userId, Guid chatId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, chatId.ToString());
        }

        public async Task LeaveChat(string userId, Guid chatId)
        {
            await Groups.RemoveFromGroupAsync(userId, chatId.ToString());
        }

        public async Task SendMessage(CreateMessageDto message)
        {
            // create the message and wait for it to be stored in postgres
            var messageResult = await _messageRepository.createOneAsync(message);
            
            if(messageResult == null)
            {
                await Clients.Group(message.ChatGroupId.ToString()).SendAsync("ErrorMessage", messageResult);
                return;
            }
            
            await Clients.Group(message.ChatGroupId.ToString()).SendAsync("ReceiveMessage", messageResult);
        }
    }
}
