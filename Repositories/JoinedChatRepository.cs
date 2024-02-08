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
using ShoppingProject.Models;

namespace chatapp.Repositories
{
    public class JoinedChatGroupRepository : IRepository<
        JoinedChatDto,
        JoinedChatQueryObject,
        CreateJoinedChatDto,
        UpdateJoinedChatDto
    >
    {
        private readonly AplicationDbContext _context;
        public JoinedChatGroupRepository(AplicationDbContext context)
        {
            _context = context;
        }

        public async Task<JoinedChatDto?> createOneAsync(CreateJoinedChatDto model, CancellationToken cancellationToken = default)
        {
            var id = Guid.NewGuid();

            var foundChatGroup = await _context.ChatGroups.FindAsync(model.ChatGroupId);

            if (foundChatGroup == null)
            {
                // the ChatGroup needs to be specified
                return null;
            }

            if (model.UserId == null)
            {
                // the UserId needs to be specified
                return null;
            }

            _context.JoinedChats.Add(new JoinedChat
            {
                Id = id,
                ChatGroupId = model.ChatGroupId,
                UserId = model.UserId,
                IsAccepted = model.IsAccepted,
                IsAdmin = model.IsAdmin,
                IsBanned = model.IsBanned,
            });

            int result = await _context.SaveChangesAsync(cancellationToken);

            if (result > 0)
            {
                return new JoinedChatDto
                {
                    Id = id,
                    ChatGroup = foundChatGroup,
                    IsAccepted = model.IsAccepted,
                    IsAdmin = model.IsAdmin,
                    IsBanned = model.IsBanned
                };
            }

            return null;
        }

        public async Task<string?> deleteOneAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var joinedChat = await _context.JoinedChats.FindAsync(id);
            if (joinedChat == null)
            {
                return "You are not in this chat";
            }

            _context.JoinedChats.Remove(joinedChat);
            int result = await _context.SaveChangesAsync(cancellationToken);

            if (result > 0)
            {
                return "Left successfully";
            }

            return "Error leaving... Seems like you are stuck here";
        }

        public async Task<List<JoinedChatDto>> getAllAsync(JoinedChatQueryObject queryObject, CancellationToken cancellationToken = default)
        {
            var query = _context.JoinedChats.AsQueryable();

            if (!String.IsNullOrWhiteSpace(queryObject.FilterBy))
            {
                if (queryObject.FilterBy == "IsAccepted")
                {
                    query = query.Where(m => m.IsAccepted == true);
                }
                else if (queryObject.FilterBy == "IsAdmin")
                {
                    query = query.Where(m => m.IsAdmin == true);
                }
                else if (queryObject.FilterBy == "IsBanned")
                {
                    query = query.Where(m => m.IsBanned == true);
                }
            }

            query = query.Skip((queryObject.Page - 1) * queryObject.PageSize).Take(queryObject.PageSize);

            var result = (await query.ToListAsync()).Select(m => new JoinedChatDto
            {
                Id = m.Id,
                ChatGroup = m.ChatGroup,
                IsAccepted = m.IsAccepted,
                IsAdmin = m.IsAdmin,
                IsBanned = m.IsBanned
            });

            return result.ToList();
        }

        public async Task<JoinedChatDto?> getOneAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var found = await _context.JoinedChats.FindAsync(id, cancellationToken);

            if (found == null)
            {
                return null;
            }

            return new JoinedChatDto
            {
                Id = found.Id,
                ChatGroup = found.ChatGroup,
                IsAccepted = found.IsAccepted,
                IsAdmin = found.IsAdmin,
                IsBanned = found.IsBanned
            };
        }

        public async Task<JoinedChatDto?> updateOneAsync(UpdateJoinedChatDto model, CancellationToken cancellationToken = default)
        {
            // bring the chatgroup too
            
            var found = await _context.JoinedChats.Include(c => c.ChatGroup).FirstOrDefaultAsync(c => c.Id == model.Id, cancellationToken);

            if (found == null) return null;

            found.ChatGroup.User = null!;
            found.IsAccepted = model.IsAccepted;
            found.IsBanned = model.IsBanned;
            found.IsAdmin = model.IsAdmin;

            _context.JoinedChats.Update(found);

            int result = await _context.SaveChangesAsync(cancellationToken);

            if (result > 0)
            {
                return new JoinedChatDto
                {
                    Id = found.Id,
                    ChatGroup = found.ChatGroup,
                    IsAccepted = found.IsAccepted,
                    IsAdmin = found.IsAdmin,
                    IsBanned = found.IsBanned,
                    UserId = found.UserId
                };
            }
            return null;
        }

        public async Task<AppUser?> getOwner(Guid joinedChatId, CancellationToken ct)
        {
            if (joinedChatId == Guid.Empty) return null;

            var query = await _context.JoinedChats.AsQueryable().Where(jc => jc.Id == joinedChatId).Select(jc => jc.ChatGroup.User).ToListAsync(ct);
            if (query == null) return null;

            return query.FirstOrDefault()!;
        }
    }
}