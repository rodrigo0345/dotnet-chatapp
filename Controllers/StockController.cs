using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShoppingProject.Data;
using ShoppingProject.Dtos.Stock;
using ShoppingProject.Helpers;
using ShoppingProject.Interfaces;
using ShoppingProject.Mappers;
using ShoppingProject.Models;

namespace ShoppingProject.Controllers
{
    [Route("api/stock")]
    [ApiController]
    [Authorize]
    public class StockController : Controller
    {
        private readonly AplicationDbContext _context;
        private readonly IStockRepository _stockRepository;

        public StockController(AplicationDbContext context, IStockRepository stockRepository)
        {
            _context = context;
            _stockRepository = stockRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] QueryObject query, CancellationToken ct)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var stocks = await _stockRepository.GetAllStocksAsync(query, ct);
            return Ok(stocks);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id, CancellationToken ct)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var stock = await _stockRepository.GetStocksAsync(id, ct);
            if (stock == null)
            {
                return NotFound();
            }
            return Ok(stock);
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] CreateStockDto reqstock, CancellationToken ct)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var stock = await _stockRepository.CreateStockAsync(reqstock, ct);
            return CreatedAtAction(nameof(GetById), new { id = stock.Id }, stock);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update([FromBody] CreateStockDto reqstock, [FromRoute] int id, CancellationToken ct)
        {
            var result = await _stockRepository.UpdateStockAsync(id, reqstock, ct);
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id, CancellationToken ct)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            await _stockRepository.DeleteStockAsync(id, ct);
            return NoContent();
        }

    }
}