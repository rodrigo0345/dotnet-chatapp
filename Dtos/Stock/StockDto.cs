using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ShoppingProject.Dtos.Comment;
using ShoppingProject.Models;

namespace ShoppingProject.Dtos.Stock
{
    public class StockDto
    {
        public int Id { get; set; }
        public string CompanyName { get; set; } = String.Empty;
        public string Symbol { get; set; } = String.Empty;
        public decimal Price { get; set; }
        public decimal LastDiv { get; set; }
        public string Industry { get; set; } = String.Empty;
        public long MarketCap { get; set; }
        public List<CommentDto> Comments { get; set; } = new List<CommentDto>();
    }
}