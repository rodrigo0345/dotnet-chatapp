using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Azure.Core;
using chatapp.Dtos.Message;
using chatapp.Helpers;
using chatapp.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace chatapp.Controllers
{

    [ApiController]
    [Route("api/message")]
    public class MessageController : Controller
    {
        private readonly MessageRepository _messageRepository;
        public MessageController(MessageRepository messageRepository)
        {
            _messageRepository = messageRepository;
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage([FromBody] CreateMessageDto dto, CancellationToken ct)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if(String.IsNullOrEmpty(dto.Content) && String.IsNullOrEmpty(dto.Attachment))
            {
                return BadRequest("Invalid message");
            }
                
            if(!String.IsNullOrEmpty(dto.SenderId))
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userId == null) return BadRequest("User not found");
                dto.SenderId = userId;
            }

            var result = await _messageRepository.createOneAsync(dto, ct);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(500, "It was not possible to create the message");
        }

        [HttpPut]
        public async Task<IActionResult> UpdateMessage(UpdateMessageDto updateMessageDto, CancellationToken ct)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _messageRepository.updateOneAsync(updateMessageDto, ct);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(500, "It was not possible to update the message");
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteMessage(Guid id, CancellationToken ct)
        {
            var result = await _messageRepository.deleteOneAsync(id, ct);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(500, "It was not possible to delete the message");
        }


        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetMessage(Guid id, CancellationToken ct)
        {
            var result = await _messageRepository.getOneAsync(id, ct);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(500, "It was not possible to get the message");
        }

        [HttpGet]
        public async Task<IActionResult> GetMessages([FromQuery] MessageQueryObject queryObject, CancellationToken ct)
        {
            var result = await _messageRepository.getAllAsync(queryObject, ct);

            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(500, "It was not possible to get the messages");

        }
    }
}