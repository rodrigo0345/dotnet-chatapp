using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ShoppingProject.Models;

namespace ShoppingProject.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(AppUser user);
    }
}