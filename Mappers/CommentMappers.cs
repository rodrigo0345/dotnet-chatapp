using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ShoppingProject.Dtos.Comment;
using ShoppingProject.Dtos.Stock;
using ShoppingProject.Models;

namespace ShoppingProject.Mappers
{
    public static class CommentMappers
    {
        public static CommentDto ToCommentDto(this Comment commentModel)
        {
            return new CommentDto
            {
                Id = commentModel.Id,
                Content = commentModel.Content,
                Title = commentModel.Title,
                CreatedOn = commentModel.CreatedOn,
                StockId = commentModel.StockId,
            };
        }

        public static Comment ToCommentFromCreateCommentDto(this CreateCommentDto createCommentDto)
        {
            return new Comment
            {
                Content = createCommentDto.Content,
                Title = createCommentDto.Title,
                StockId = createCommentDto.StockId,
            };
        }
    }
}