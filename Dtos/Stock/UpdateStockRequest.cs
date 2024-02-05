using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingProject.Dtos.Stock
{
    public class UpdateStockRequest
    {
        public string CompanyName { get; set; } = String.Empty;
        public string Symbol { get; set; } = String.Empty;
        public decimal Price { get; set; }
        public decimal LastDiv { get; set; }
        public string Industry { get; set; } = String.Empty;
        public long MarketCap { get; set; }
    }
}