
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using ShoppingProject.Models;

namespace ShoppingProject.Models
{
    [Table("Portfolios")]
    public class Portfolio
    {

        public string AppUserId { get; set; }
        public int StockId { get; set; }

        public AppUser AppUser { get; set; } = null!;
        public Stock Stock { get; set; } = null!;

    }
}