using chatapp.Dtos.Message;
using Microsoft.AspNetCore.SignalR;

namespace ShoppingProject.Controllers
{
    public class ChatHub: Hub
    {
        public async Task JoinChat(string userId, Guid chatId)
        {
            await Groups.AddToGroupAsync(userId, chatId.ToString());
        }

        public async Task LeaveChat(string userId, Guid chatId)
        {
            await Groups.RemoveFromGroupAsync(userId, chatId.ToString());
        }

        public async Task SendMessage(CreateMessageDto message)
        {
            await Clients.Group(message.ChatGroupId.ToString()).SendAsync("ReceiveMessage", message);
        }
    }
}
