using chatapp.Dtos.Message;
using chatapp.Helpers;
using chatapp.Repositories;
using Microsoft.AspNetCore.Mvc;
using ShoppingProject.Extensions;
using System.Security.Claims;

namespace chatapp.Controllers
{

    [ApiController]
    [Route("api/chats")]
    public class JoinedChatController : Controller
    {
        private readonly JoinedChatGroupRepository _joinedChatGroupRepository;
        private readonly ChatGroupRepository _chatGroupRepository;
        public JoinedChatController(JoinedChatGroupRepository joinedChatGroupRepository, ChatGroupRepository chatGroupRepository)
        {
            _joinedChatGroupRepository = joinedChatGroupRepository;
            _chatGroupRepository = chatGroupRepository;
        }

        [HttpPost]
        public async Task<IActionResult> JoinChat([FromBody] CreateJoinedChatDto create, CancellationToken ct)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            create.IsAccepted = false;
            create.UserId = userId;

            // if the user is the owner pass accepted to true
            var chatgroup = await _chatGroupRepository.getOneAsync(create.ChatGroupId, ct);
            if(chatgroup == null)
            {
                return BadRequest("Chat Group does not exist");
            }

            if (String.IsNullOrEmpty(chatgroup.OwnerId))
            {
                chatgroup.OwnerId = userId;
            }

            if(chatgroup.OwnerId.ToString() == userId)
            {
                create.IsAccepted = true;
                create.IsAdmin = true;
            }
            

            var result = await _joinedChatGroupRepository.createOneAsync(create, ct);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(500, "It was not possible to create the message");
        }

        // <summary>
        // This method is used to update the status of the user in the chat group
        // Only the admin of the group can update the status of the user
        // </summary>

        [HttpPut]
        public async Task<IActionResult> UpdateChat([FromBody] UpdateJoinedChatDto updateChatGroupDto, CancellationToken ct)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // verify that the user logged in is the owner of the chat group
            var request = await _joinedChatGroupRepository.getOwner(updateChatGroupDto.Id, ct);

            if (request == null) return BadRequest("Invalid id");

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            if (request!.Id != userId)
            {
                return BadRequest("You are not the owner of this chat group");
            }

            var result = await _joinedChatGroupRepository.updateOneAsync(updateChatGroupDto, ct);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(500, "It was not possible to update the user status in the group");
        }


        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteChat(Guid id)
        {
            var result = await _joinedChatGroupRepository.deleteOneAsync(id);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(500, "It was not possible leave the chat group");
        }


        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetChatGroup(Guid id, CancellationToken ct)
        {
            var result = await _joinedChatGroupRepository.getOneAsync(id, ct);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(500, "It was not possible to get the message");
        }

        [HttpGet]
        public async Task<IActionResult> GetChatGroups([FromQuery] JoinedChatQueryObject queryObject, CancellationToken ct)
        {
            var result = await _joinedChatGroupRepository.getAllAsync(queryObject, ct);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(500, "It was not possible to get the messages");
        }
    }
}