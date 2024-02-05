using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingProject.Dtos.Portfolio
{
    public class PortfolioDto
    {
        [Required]
        public string userId { get; set; } = null!;

        [Required]
        public int stockId { get; set; }
    }
}