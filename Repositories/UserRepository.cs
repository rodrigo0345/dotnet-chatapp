using ccnd.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;
using ShoppingProject.Data;
using ShoppingProject.Dtos.User;
using ShoppingProject.Helpers;
using ShoppingProject.Models;

namespace ShoppingProject.Repositories
{
    public class UserRepository : IRepository<
            UserDto,
            UserQueryObject,
            RegisterDto,
            UpdateUserDto
        >
    {
        private readonly AplicationDbContext _context;
        public UserRepository(AplicationDbContext context)
        {
            _context = context;
        }

        public Task<UserDto?> createOneAsync(RegisterDto model, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public async Task<string?> deleteOneAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var found = await _context.Users.FirstOrDefaultAsync(_context => _context.Id == id.ToString(), cancellationToken);
            if (found == null)
                return "User does not exist";

            _context.Users.Remove(found);
            int result = await _context.SaveChangesAsync(cancellationToken);

            if (result < 0) return "Not possible to delete";

            return null;
        }

        public async Task<List<UserDto>> getAllAsync(UserQueryObject queryObject, CancellationToken cancellationToken = default)
        {
            var query = _context.Users.AsQueryable();

            if (!String.IsNullOrWhiteSpace(queryObject.FilterBy))
            {
                if(!String.IsNullOrWhiteSpace(queryObject.FilterValue))
                {
                    return new List<UserDto>();
                }

                if(queryObject.FilterBy.Equals("Username"))
                {
                    query = query.Where(c => c.UserName!.Contains(queryObject.FilterValue!));
                }
            }

            // limit
            query = query.Skip((queryObject.Page - 1) * queryObject.PageSize).Take(queryObject.PageSize);

            var users = await query.ToListAsync(cancellationToken);
            return users.Select(u => new UserDto
            {
                Email = u.Email!,
                Username = u.UserName!,
            }).ToList();
        }

        public async Task<UserDto?> getOneAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var found = await _context.Users.FindAsync(id.ToString(), cancellationToken);

            if (found == null) return null;

            return new UserDto
            {
                Email = found.Email!,
                Username = found.UserName!
            };
        }

        public async Task<UserDto?> updateOneAsync(UpdateUserDto model, CancellationToken cancellationToken = default)
        {
            var found = await _context.Users.FindAsync(model.Id.ToString(), cancellationToken);

            if (found == null) return null;

            found.Email = model.Email;
            found.NormalizedEmail = model.Email.Normalize();
            found.UserName = model.Username;

            _context.Users.Update(found);
            await _context.SaveChangesAsync(cancellationToken);

            return new UserDto
            {
                Email = found.Email,
                Username = found.UserName
            };
        }
        
        public async Task<AppUser?> GetUserByUsernameAsync(string username, CancellationToken ct)
        {
            var result = await _context.Users.FirstOrDefaultAsync(x => x.UserName == username, ct);
            return result;
        }
    }
}
