using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using chatapp.Dtos.Message;
using chatapp.Helpers;
using chatapp.Models;
using chatapp.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace chatapp.Controllers
{

    [Route("api/message")]
    public class MessageController : Controller
    {
        private readonly MessageRepository _messageRepository;
        public MessageController(MessageRepository messageRepository)
        {
            _messageRepository = messageRepository;
        }

        [HttpPost()]
        public async Task<IActionResult> CreateMessage([FromBody] CreateMessageDto createMessageDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            createMessageDto.SenderId = Guid.Parse(User.Identity!.Name!);

            var result = await _messageRepository.createOneAsync(createMessageDto);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(500, "It was not possible to create the message");
        }

        [HttpPut()]
        public async Task<IActionResult> UpdateMessage([FromBody] UpdateMessageDto updateMessageDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _messageRepository.updateOneAsync(updateMessageDto);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(500, "It was not possible to update the message");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMessage(Guid id)
        {
            var result = await _messageRepository.deleteOneAsync(id);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(500, "It was not possible to delete the message");
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetMessage(Guid id)
        {
            var result = await _messageRepository.getOneAsync(id);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(500, "It was not possible to get the message");
        }

        [HttpGet()]
        public async Task<IActionResult> GetMessages([FromQuery] MessageQueryObject queryObject)
        {
            var result = await _messageRepository.getAllAsync(queryObject);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(500, "It was not possible to get the messages");
        }

    }
}