using ShoppingProject.Models;

namespace ShoppingProject.Dtos.Comment
{
    public class CommentDto
    {
        
        public int Id { get; set; }
        public string Title { get; set; } = String.Empty;
        public string Content { get; set; } = String.Empty;
        public DateTime CreatedOn { get; set; }
        public int? StockId { get; set; }
    }
}