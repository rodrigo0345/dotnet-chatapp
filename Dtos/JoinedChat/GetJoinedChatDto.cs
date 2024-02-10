namespace ShoppingProject.Dtos.JoinedChat
{
    public class GetJoinedChatDto
    {
        public Guid Id { get; set; } = Guid.Empty;
        public string filterBy { get; set; } = String.Empty;
        public string UserId { get; set; } = String.Empty;
    }
}
