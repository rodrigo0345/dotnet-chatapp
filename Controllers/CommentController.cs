using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using ShoppingProject.Dtos.Comment;
using ShoppingProject.Interfaces;

namespace ShoppingProject.Controllers
{
    [Route("api/comments")]
    [ApiController]
    public class CommentController : Controller
    {
        private readonly ICommentRepository _commentRepository;
        public CommentController(ICommentRepository commentRepository)
        {
            _commentRepository = commentRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllComments(
            CancellationToken ct
        )
        {
            return Ok(await _commentRepository.GetAllCommentsAsync(ct));
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetComment(
            CancellationToken ct, [FromRoute] int id
        )
        {
            var result = await _commentRepository.GetCommentAsync(id, ct);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateComment(
            CancellationToken ct, [FromRoute] int id, [FromBody] UpdateCommentDto updateComment
        )
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _commentRepository.UpdateCommentAsync(id, updateComment, ct);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteComment(
            CancellationToken ct, [FromRoute] int id
        )
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _commentRepository.DeleteCommentAsync(id, ct);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateComment(
            CancellationToken ct, [FromBody] CreateCommentDto comment
        )
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _commentRepository.CreateCommentAsync(comment, ct);
            if (result == null)
            {
                return BadRequest("StockId does not exist");
            }
            return Ok(result);
        }

    }
}