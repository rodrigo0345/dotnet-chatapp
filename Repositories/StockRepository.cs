using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ShoppingProject.Data;
using ShoppingProject.Dtos.Stock;
using ShoppingProject.Helpers;
using ShoppingProject.Interfaces;
using ShoppingProject.Mappers;

namespace ShoppingProject.Repositories
{
    public class StockRepository : IStockRepository
    {
        private readonly AplicationDbContext _context;
        public StockRepository(AplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int?> DeleteStockAsync(int Id, CancellationToken cancellationToken = default)
        {
            _context.Remove(Id);
            return await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task<List<StockDto>?> GetAllStocksAsync(QueryObject query, CancellationToken cancellationToken = default)
        {
            var stock = _context.Stock.Include(c => c.Comments).AsQueryable();

            if (!string.IsNullOrWhiteSpace(query.CompanyName))
            {
                stock = stock.Where(c => c.CompanyName.Contains(query.CompanyName));
            }

            if (!string.IsNullOrWhiteSpace(query.Symbol))
            {
                stock = stock.Where(c => c.Industry.Contains(query.Symbol));
            }

            if (!string.IsNullOrWhiteSpace(query.SortBy))
            {
                if (query.SortBy.Equals("Symbol", StringComparison.OrdinalIgnoreCase))
                {
                    stock = query.IsSortAscending ? stock.OrderBy(c => c.Symbol) : stock.OrderByDescending(c => c.Symbol);
                }
            }

            var skipNumber = (query.PageNumber - 1) * query.PageSize;

            stock = stock.Skip(skipNumber).Take(query.PageSize);

            return (await stock.ToListAsync(cancellationToken)).Select(c => c.ToStockDto()).ToList();
        }

        public async Task<StockDto?> GetStocksAsync(int Id, CancellationToken cancellationToken = default)
        {
            var result = await _context.Stock.Include(c => c.Comments).FirstOrDefaultAsync(c => c.Id == Id, cancellationToken);

            if (result == null)
            {
                return null;
            }

            return result.ToStockDto();
        }


        public async Task<StockDto?> UpdateStockAsync(int Id, CreateStockDto createStockDto, CancellationToken cancellationToken = default)
        {
            var model = await _context.Stock.FindAsync(Id, cancellationToken);
            if (model == null)
            {
                return null;
            }

            model.CompanyName = createStockDto.CompanyName;
            model.Industry = createStockDto.Industry;
            model.Price = createStockDto.Price;
            model.LastDiv = createStockDto.LastDiv;
            model.MarketCap = createStockDto.MarketCap;
            model.Symbol = createStockDto.Symbol;

            await _context.SaveChangesAsync(cancellationToken);
            return model.ToStockDto();
        }

        public async Task<StockDto> CreateStockAsync(CreateStockDto createStockDto, CancellationToken cancellationToken = default)
        {
            var model = new Models.Stock
            {
                CompanyName = createStockDto.CompanyName,
                Industry = createStockDto.Industry,
                Price = createStockDto.Price,
                LastDiv = createStockDto.LastDiv,
                MarketCap = createStockDto.MarketCap,
                Symbol = createStockDto.Symbol
            };

            await _context.Stock.AddAsync(model, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
            return model.ToStockDto();
        }
    }
}