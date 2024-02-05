using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ShoppingProject.Data;
using ShoppingProject.Dtos.Portfolio;
using ShoppingProject.Interfaces;
using ShoppingProject.Models;

namespace ShoppingProject.Repositories
{
    public class PortfolioRepository : IPortfolioRepository
    {
        private readonly AplicationDbContext _dbContext;
        public PortfolioRepository(AplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<int> AddStockToPortfolio(PortfolioDto portfolio, CancellationToken ct)
        {
            _dbContext.Portfolio.Add(new Portfolio
            {
                AppUserId = portfolio.userId,
                StockId = portfolio.stockId
            });


            try
            {
                return await _dbContext.SaveChangesAsync(ct);
            }
            catch (Exception _)
            {
                return 0;
            }
        }

        public async Task<List<Stock>> GetUserPortfolio(string userId, CancellationToken ct)
        {
            return await _dbContext.Portfolio.Where(p => p.AppUserId == userId).Select(p => p.Stock).ToListAsync(ct);
        }

    }
}