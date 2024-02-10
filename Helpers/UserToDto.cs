using ShoppingProject.Dtos.User;
using ShoppingProject.Models;

namespace ShoppingProject.Helpers
{
    public static class UserToDto
    {
        public static UserDto UserToUserDto(this AppUser user)
        {
            return new UserDto
            {
                Id = user.Id!,
                Email = user.Email!,
                Username = user.UserName!,
                Token = null
            };
        }
    }
}
