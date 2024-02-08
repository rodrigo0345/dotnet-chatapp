using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using ccnd.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShoppingProject.Data;
using ShoppingProject.Dtos.User;
using ShoppingProject.Helpers;
using ShoppingProject.Models;
using ShoppingProject.Repositories;
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
        private readonly UserRepository _userRepository;

        public AccountController(UserManager<AppUser> userManager, ITokenService tokenService, SignInManager<AppUser> signInManager, UserRepository userRepository)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _userRepository = userRepository;
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
                            Id = appUser.Id,
                            Username = appUser.UserName!,
                            Email = appUser.Email!,
                            Token = await _tokenService.CreateToken(appUser)
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
                Id = user.Id,
                Username = user.UserName!,
                Email = user.Email!,
                Token = await _tokenService.CreateToken(user)
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(string id, CancellationToken ct)
        {
            var result = await _userRepository.getOneAsync(Guid.Parse(id), ct);
            if(result == null)
            {
                return BadRequest("No user found");
            }
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers([FromQuery] UserQueryObject obj,  CancellationToken ct)
        {
            var result = await _userRepository.getAllAsync(obj, ct);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id, CancellationToken ct)
        {
            var result = await _userRepository.deleteOneAsync(Guid.Parse(id), ct);

            if (result == null) return Ok("User deleted");
            return BadRequest(result);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateUser(UpdateUserDto dto, CancellationToken ct)
        {
            dto.Id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;

            if (dto.Id == null) return BadRequest("Error");

            var result = await _userRepository.updateOneAsync(dto, ct);

            if(result == null)
            {
                return BadRequest("Error updating user");
            }
            return Ok(result);
        }
    }
}