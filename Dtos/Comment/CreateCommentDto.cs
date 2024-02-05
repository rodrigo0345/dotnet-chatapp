using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingProject.Dtos.Comment
{
    public class CreateCommentDto
    {
        [Required]
        [MinLength(3, ErrorMessage = "Title must be at least 3 characters long")]
        [MaxLength(50, ErrorMessage = "Title must be under 50 characters long")]
        public string Title { get; set; } = String.Empty;

        [Required]
        [MinLength(3, ErrorMessage = "Content must be at least 3 characters long")]
        public string Content { get; set; } = String.Empty;

        [Required]
        public int StockId { get; set; }
    }
}