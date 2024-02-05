using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ShoppingProject.Dtos.Comment;

namespace ShoppingProject.Interfaces
{
    public interface ICommentRepository
    {
        Task<List<CommentDto>?> GetAllCommentsAsync(
            CancellationToken cancellationToken = default
        );
        Task<CommentDto?> GetCommentAsync(
            int Id,
            CancellationToken cancellationToken = default
        );
        Task<CommentDto?> UpdateCommentAsync(
            int Id,
            UpdateCommentDto updateCommentDto,
            CancellationToken cancellationToken = default
        );
        Task<int?> DeleteCommentAsync(
            int Id,
            CancellationToken cancellationToken = default
        );
        Task<CommentDto?> CreateCommentAsync(
            CreateCommentDto createCommentDto,
            CancellationToken cancellationToken = default
        );
    }
}