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
    public class MessageRepository : IRepository<
        MessageDto,
        MessageQueryObject,
        CreateMessageDto,
        UpdateMessageDto
    >
    {
        private readonly AplicationDbContext _context;
        public MessageRepository(AplicationDbContext context)
        {
            _context = context;
        }

        public async Task<MessageDto?> createOneAsync(CreateMessageDto model, CancellationToken cancellationToken = default)
        {
            var id = Guid.NewGuid();
            _context.Messages.Add(new Message
            {
                Id = id,
                Content = model.Content,
                Attachment = model.Attachment,
                SenderId = model.SenderId,
                ChatGroupId = model.ChatGroupId,
                Type = model.Type
            });
            int result = await _context.SaveChangesAsync(cancellationToken);

            if (result > 0)
            {
                return new MessageDto
                {
                    Id = id,
                    Content = model.Content,
                    Attachment = model.Attachment,
                    SenderId = model.SenderId,
                    ChatGroupId = model.ChatGroupId,
                    Type = model.Type
                };
            }

            return null;
        }

        public async Task<string?> deleteOneAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var message = await _context.Messages.FindAsync(id);
            if (message == null)
            {
                return "Message not found";
            }

            _context.Messages.Remove(message);
            int result = await _context.SaveChangesAsync(cancellationToken);

            if (result > 0)
            {
                return null;
            }

            return "Error deleting message";
        }

        public async Task<List<MessageDto>> getAllAsync(MessageQueryObject queryObject, CancellationToken cancellationToken = default)
        {
            var query = _context.Messages.AsQueryable();

            // needs to specfify the chat group id
            query = query.Where(m => m.ChatGroupId == queryObject.ChatGroupId);

            if (queryObject.Type != null)
            {
                query = query.Where(m => m.Type == queryObject.Type);
            }

            if (queryObject.FilterBy != null)
                switch (queryObject.FilterBy)
                {
                    case "SenderId":
                        query = query.Where(m => m.SenderId.ToString() == queryObject.FilterValue);
                        break;
                }

            switch (queryObject.OrderBy)
            {
                case "CreatedOn":
                    query = queryObject.IsDescending ? query.OrderByDescending(m => m.CreatedOn) : query.OrderBy(m => m.CreatedOn);
                    break;
                case "Content":
                    query = queryObject.IsDescending ? query.OrderByDescending(m => m.Content) : query.OrderBy(m => m.Content);
                    break;
                default:
                    query = queryObject.IsDescending ? query.OrderByDescending(m => m.CreatedOn) : query.OrderBy(m => m.CreatedOn);
                    break;
            }

            query = query.Skip((queryObject.Page - 1) * queryObject.PageSize).Take(queryObject.PageSize);

            var result = (await query.ToListAsync()).Select(m => new MessageDto
            {
                Id = m.Id,
                Content = m.Content,
                Attachment = m.Attachment,
                CreatedOn = m.CreatedOn,
                Type = m.Type,
                ChatGroupId = m.ChatGroupId,
                SenderId = m.SenderId
            });

            return result.ToList();
        }

        public async Task<MessageDto?> getOneAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var found = await _context.Messages.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

            if (found == null)
            {
                return null;
            }

            return new MessageDto
            {
                Id = found.Id,
                Content = found.Content,
                Attachment = found.Attachment,
                CreatedOn = found.CreatedOn,
                Type = found.Type,
                ChatGroupId = found.ChatGroupId,
                SenderId = found.SenderId
            };
        }

        public async Task<MessageDto?> updateOneAsync(UpdateMessageDto model, CancellationToken cancellationToken = default)
        {
            var found = await _context.Messages.FirstOrDefaultAsync(c => c.Id == model.Id, cancellationToken);

            if (found == null) return null;

            var enumType = Enum.TryParse<MessageType>(model.Type, out var type);

            if (!enumType) return null;

            _context.Messages.Update(new Message
            {
                Id = model.Id,
                Content = model.Content,
                Attachment = model.Attachment,
                Type = type
            });
            int result = await _context.SaveChangesAsync(cancellationToken);

            if (result > 0)
            {
                return new MessageDto
                {
                    Id = model.Id,
                    Content = model.Content,
                    Attachment = model.Attachment,
                    Type = type,
                    ChatGroupId = found.ChatGroupId,
                    CreatedOn = found.CreatedOn,
                    SenderId = found.SenderId
                };
            }
            return null;
        }
    }
}