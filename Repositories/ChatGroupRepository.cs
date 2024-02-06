using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ccnd.Interfaces.Repositories;
using chatapp.Dtos.Message;
using chatapp.Helpers;
using chatapp.Models;
using Microsoft.EntityFrameworkCore;
using ShoppingProject.Data;

namespace chatapp.Repositories
{
    public class ChatGroupRepository : IRepository<
        ChatGroupDto,
        ChatGroupQueryObject,
        CreateChatGroupDto,
        UpdateChatGroupDto
    >
    {
        private readonly AplicationDbContext _context;
        public ChatGroupRepository(AplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ChatGroupDto?> createOneAsync(CreateChatGroupDto model, CancellationToken cancellationToken = default)
        {
            var id = Guid.NewGuid();
            _context.ChatGroups.Add(new ChatGroup
            {
                Id = id,
                Name = model.Name,
                Logo = model.Logo,
                UserId = model.OwnerId
            });
            int result = await _context.SaveChangesAsync(cancellationToken);

            if (result > 0)
            {
                return new ChatGroupDto
                {
                    Id = id,
                    Name = model.Name,
                    Logo = model.Logo,
                    OwnerId = model.OwnerId
                };
            }

            return null;
        }

        public async Task<string?> deleteOneAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var message = await _context.ChatGroups.FindAsync(id);
            if (message == null)
            {
                return "ChatGroup not found";
            }

            _context.ChatGroups.Remove(message);
            int result = await _context.SaveChangesAsync(cancellationToken);

            if (result > 0)
            {
                return "Deleted successfully";
            }

            return "Error deleting message";
        }

        public async Task<List<ChatGroupDto>> getAllAsync(ChatGroupQueryObject queryObject, CancellationToken cancellationToken = default)
        {
            var query = _context.ChatGroups.AsQueryable();
            query = query.Skip((queryObject.Page - 1) * queryObject.PageSize).Take(queryObject.PageSize);

            var result = (await query.ToListAsync()).Select(m => new ChatGroupDto
            {
                Id = m.Id,
                Name = m.Name,
                Logo = m.Logo,
                OwnerId = m.UserId
            });

            return result.ToList();
        }

        public async Task<ChatGroupDto?> getOneAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var found = await _context.ChatGroups.FindAsync(id, cancellationToken);

            if (found == null)
            {
                return null;
            }

            return new ChatGroupDto
            {
                Id = found.Id,
                Name = found.Name,
                Logo = found.Logo
            };
        }

        public async Task<ChatGroupDto?> updateOneAsync(UpdateChatGroupDto model, CancellationToken cancellationToken = default)
        {
            var found = await _context.ChatGroups.FirstOrDefaultAsync(c => c.Id == model.Id, cancellationToken);

            if (found == null) return null;

            _context.ChatGroups.Update(new ChatGroup
            {
                Id = model.Id,
                Name = model.Name,
                Logo = model.Logo
            });
            int result = await _context.SaveChangesAsync(cancellationToken);

            if (result > 0)
            {
                return new ChatGroupDto
                {
                    Id = model.Id,
                    Name = model.Name,
                    Logo = model.Logo,
                    OwnerId = found.UserId
                };
            }
            return null;
        }
    }
}