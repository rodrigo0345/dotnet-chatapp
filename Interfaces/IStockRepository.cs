using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ShoppingProject.Dtos.Stock;
using ShoppingProject.Helpers;

namespace ShoppingProject.Interfaces
{
    public interface IStockRepository
    {
        Task<List<StockDto>?> GetAllStocksAsync(
            QueryObject query,
            CancellationToken cancellationToken = default
        );
        Task<StockDto?> GetStocksAsync(
            int Id,
            CancellationToken cancellationToken = default
        );
        Task<StockDto?> UpdateStockAsync(
            int Id,
            CreateStockDto createStockDto,
            CancellationToken cancellationToken = default
        );
        Task<int?> DeleteStockAsync(
            int Id,
            CancellationToken cancellationToken = default
        );
        Task<StockDto> CreateStockAsync(
            CreateStockDto createStockDto,
            CancellationToken cancellationToken = default
        );
    }
}