using System.Security.Claims;
using chatapp.Dtos.Message;
using chatapp.Helpers;
using chatapp.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace chatapp.Controllers
{

    [ApiController]
    [Route("api/group")]
    [Authorize]
    public class ChatGroupController : Controller
    {
        private readonly ChatGroupRepository _chatGroupRepository;
        public ChatGroupController(ChatGroupRepository chatGroupRepository)
        {
            _chatGroupRepository = chatGroupRepository;
        }

        [HttpPost]
        public async Task<IActionResult> CreateChatGroup([FromBody] CreateChatGroupDto createChatGroup, CancellationToken ct)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            Console.WriteLine($"Your id: {User.Identity!.Name!}");

            if (String.IsNullOrWhiteSpace(createChatGroup.OwnerId))
            {
                if (User.Identity!.Name == null)
                {
                    return BadRequest("Invalid user");
                }

                // set the owner of the chat group to the user that is logged in
                createChatGroup.OwnerId = User.Identity!.Name!;
                Console.WriteLine($"Your id: {User.Identity!.Name!}");
            }

            var result = await _chatGroupRepository.createOneAsync(createChatGroup, ct);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(501, "It was not possible to create the message");
        }

        [HttpPut]
        public async Task<IActionResult> UpdateChatGroup([FromBody] UpdateChatGroupDto updateChatGroupDto, CancellationToken ct)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // check for valid id
            if (updateChatGroupDto.Id == Guid.Empty)
            {
                return BadRequest("Invalid id");
            }

            var result = await _chatGroupRepository.updateOneAsync(updateChatGroupDto, ct);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(501, "It was not possible to update the message");
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteChatGroup(Guid id)
        {
            var result = await _chatGroupRepository.deleteOneAsync(id);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(501, "It was not possible to delete the message");
        }


        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetChatGroup([FromRoute] Guid id, CancellationToken ct)
        {
            var result = await _chatGroupRepository.getOneAsync(id, ct);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(500, "It was not possible to get the message");
        }

        [HttpGet()]
        public async Task<IActionResult> GetChatGroups([FromQuery] ChatGroupQueryObject queryObject, CancellationToken ct)
        {
            var result = await _chatGroupRepository.getAllAsync(queryObject, ct);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(500, "It was not possible to get the messages");
        }
    }
}