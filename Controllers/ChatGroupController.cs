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
    public class ChatGroup : Controller
    {
        private readonly ChatGroupRepository _chatGroupRepository;
        public ChatGroup(ChatGroupRepository chatGroupRepository)
        {
            _chatGroupRepository = chatGroupRepository;
        }

        [HttpPost()]
        public async Task<IActionResult> CreateChatGroup([FromBody] CreateChatGroupDto createChatGroup)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _chatGroupRepository.createOneAsync(createChatGroup);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(500, "It was not possible to create the message");
        }

        [HttpPut()]
        public async Task<IActionResult> UpdateChatGroup([FromBody] UpdateChatGroupDto updateChatGroupDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _chatGroupRepository.updateOneAsync(updateChatGroupDto);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(500, "It was not possible to update the message");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteChatGroup(Guid id)
        {
            var result = await _chatGroupRepository.deleteOneAsync(id);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(500, "It was not possible to delete the message");
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetChatGroup(Guid id)
        {
            var result = await _chatGroupRepository.getOneAsync(id);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(500, "It was not possible to get the message");
        }

        [HttpGet()]
        public async Task<IActionResult> GetChatGroups([FromQuery] ChatGroupQueryObject queryObject)
        {
            var result = await _chatGroupRepository.getAllAsync(queryObject);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(500, "It was not possible to get the messages");
        }
    }
}