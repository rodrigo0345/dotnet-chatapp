using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ShoppingProject.Dtos.Portfolio;
using ShoppingProject.Models;

namespace ShoppingProject.Interfaces
{
    public interface IPortfolioRepository
    {
        public Task<List<Stock>> GetUserPortfolio(string userId, CancellationToken ct);
        public Task<int> AddStockToPortfolio(PortfolioDto portfolio, CancellationToken ct);
    }
}