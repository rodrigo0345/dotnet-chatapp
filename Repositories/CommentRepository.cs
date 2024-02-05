using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShoppingProject.Data;
using ShoppingProject.Dtos.Comment;
using ShoppingProject.Interfaces;
using ShoppingProject.Mappers;
using ShoppingProject.Models;

namespace ShoppingProject.Repositories
{
    public class CommentRepository : ICommentRepository
    {
        private readonly AplicationDbContext _context;

        public CommentRepository(AplicationDbContext context)
        {
            _context = context;
        }
        public async Task<CommentDto?> CreateCommentAsync(CreateCommentDto createCommentDto, CancellationToken cancellationToken = default)
        {
            var commentModel = createCommentDto.ToCommentFromCreateCommentDto();
            await _context.AddAsync(commentModel, cancellationToken);

            try
            {
                var result = await _context.SaveChangesAsync(cancellationToken);
            }
            catch (Exception _)
            {
                return null;
            }
            return commentModel.ToCommentDto();
        }

        public async Task<int?> DeleteCommentAsync(int Id, CancellationToken cancellationToken = default)
        {
            var comment = await _context.Comment.FindAsync(Id);
            if (comment == null)
            {
                return null;
            }
            _context.Comment.Remove(comment);
            return await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task<List<CommentDto>?> GetAllCommentsAsync(CancellationToken cancellationToken = default)
        {
            return (await _context.Comment.Include(c => c.Stock).ToListAsync(cancellationToken)).Select(el => el.ToCommentDto()).ToList();
        }

        public async Task<CommentDto?> GetCommentAsync(int Id, CancellationToken cancellationToken = default)
        {
            var result = await _context.Comment.Include(c => c.Stock).FirstOrDefaultAsync(c => c.Id == Id, cancellationToken);
            if (result == null)
            {
                return null;
            }
            return result.ToCommentDto();
        }

        public async Task<CommentDto?> UpdateCommentAsync(int Id, UpdateCommentDto createComment, CancellationToken cancellationToken = default)
        {
            var comment = await _context.Comment.FindAsync(Id, cancellationToken);
            if (comment == null)
            {
                return null;
            }
            comment.Title = createComment.Title;
            comment.Content = createComment.Content;
            comment.CreatedOn = createComment.CreatedOn;
            comment.StockId = createComment.StockId;
            await _context.SaveChangesAsync(cancellationToken);
            return comment.ToCommentDto();
        }
    }
}