using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ShoppingProject.Models;

namespace ccnd.Interfaces
{
    public interface ITokenService
    {
        public Task<string> CreateToken(AppUser user);
    }
}