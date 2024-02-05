using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ShoppingProject.Dtos.Portfolio;
using ShoppingProject.Extensions;
using ShoppingProject.Interfaces;
using ShoppingProject.Models;

namespace ShoppingProject.Controllers
{
    [ApiController]
    [Route("api/portfolio")]
    [Authorize]
    public class PortfolioController : Controller
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IStockRepository _stockRepository;
        private readonly IPortfolioRepository _portfolioRepository;
        public PortfolioController(UserManager<AppUser> userManager, IStockRepository stockRepository, IPortfolioRepository portfolioRepository)
        {
            _userManager = userManager;
            _stockRepository = stockRepository;
            _portfolioRepository = portfolioRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserPortfolio(CancellationToken ct)
        {
            var username = User.GetUsername();

            var user = await _userManager.FindByNameAsync(username);
            if (user == null) return NotFound("User not found");

            var userPortfolio = await _portfolioRepository.GetUserPortfolio(user.Id, ct);

            return Ok(userPortfolio);
        }

        [HttpPost("{stockId:int}")]
        public async Task<IActionResult> AddStockToPortfolio(CancellationToken ct, [FromRoute] int stockId)
        {
            var username = User.GetUsername();

            var user = await _userManager.FindByNameAsync(username);
            if (user == null) return NotFound("User not found");

            var stock = await _stockRepository.GetStocksAsync(stockId, ct);
            if (stock == null) return NotFound("Stock not found");

            var portfolio = new PortfolioDto
            {
                userId = user.Id,
                stockId = stock.Id
            };

            var result = await _portfolioRepository.AddStockToPortfolio(portfolio, ct);
            if (result == 0) return BadRequest("Already added.");

            return Ok(result);
        }

    }
}