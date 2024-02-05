using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using ShoppingProject.Models;

namespace ShoppingProject.Dtos.Stock
{
    public class CreateStockDto
    {
        [Required]
        [MinLength(3, ErrorMessage = "Title must be at least 3 characters long")]
        [MaxLength(50, ErrorMessage = "Title must be under 50 characters long")]
        public string CompanyName { get; set; } = String.Empty;

        [Required]
        public string Symbol { get; set; } = String.Empty;

        [Required]
        [Range(0, 1000000)]
        public decimal Price { get; set; }

        [Required]
        [Range(0, 1000000)]
        public decimal LastDiv { get; set; }

        [Required]
        [MaxLength(50, ErrorMessage = "Industry must be under 50 characters long")]
        public string Industry { get; set; } = String.Empty;

        [Required]
        public long MarketCap { get; set; }

    }
}