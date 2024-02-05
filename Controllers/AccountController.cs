using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShoppingProject.Data;
using ShoppingProject.Dtos.User;
using ShoppingProject.Interfaces;
using ShoppingProject.Models;
using ShoppingProject.Services;

namespace ShoppingProject.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : Controller
    {

        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly SignInManager<AppUser> _signInManager;

        public AccountController(UserManager<AppUser> userManager, ITokenService tokenService, SignInManager<AppUser> signInManager)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto, CancellationToken ct)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var appUser = new AppUser
                {
                    UserName = registerDto.Username,
                    Email = registerDto.Email,
                    Bio = registerDto.Bio
                };

                var createUser = await _userManager.CreateAsync(appUser, registerDto.Password!);

                if (createUser.Succeeded)
                {
                    var roleResult = await _userManager.AddToRoleAsync(appUser, Role.User.ToString());
                    if (roleResult.Succeeded)
                    {
                        return Ok(new UserDto
                        {
                            Username = appUser.UserName!,
                            Email = appUser.Email!,
                            Token = _tokenService.CreateToken(appUser)
                        });
                    }
                    return StatusCode(500);
                }

                return BadRequest(createUser.Errors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto login, CancellationToken ct)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);


            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == login.Username, ct);

            if (user == null)
            {
                return Unauthorized("Invalid username or password!");
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, login.Password, false);

            if (!result.Succeeded) return Unauthorized("Invalid username or password!");

            return Ok(new UserDto
            {
                Username = user.UserName!,
                Email = user.Email!,
                Token = _tokenService.CreateToken(user)
            });
        }
    }
}