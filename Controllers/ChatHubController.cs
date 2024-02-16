using chatapp.Dtos.Message;
using chatapp.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace ShoppingProject.Controllers
{

    // Not safe for sure, need to add authentication
    public class ChatHubController: Hub 
    {
        private readonly MessageRepository _messageRepository;
        private readonly JoinedChatGroupRepository _joinedChatGroupRepository;
        public ChatHubController( MessageRepository messageRepository, JoinedChatGroupRepository joinedChatGroupRepository)
        {
            _messageRepository = messageRepository;
            _joinedChatGroupRepository = joinedChatGroupRepository;
        }
        public async Task JoinChat(string userId, string chatId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, chatId);
        }

        public async Task ListeningForChatMessages(string userId, string chatId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "listening_" + chatId);
        }

        public async Task LeaveChat(string userId, string chatId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, chatId);
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
            await _joinedChatGroupRepository.markGroupAsNotRead(messageResult.ChatGroupId);

            // ainda preciso de notificar a malta que não tem o chat ativo que tem uma nova mensagem
            await Clients.Group("listening_" + message.ChatGroupId.ToString()).SendAsync("Listening", messageResult);
            
            await Clients.Group(message.ChatGroupId.ToString()).SendAsync("ReceiveMessage", messageResult);
        }
    }
}
