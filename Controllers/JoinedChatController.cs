using chatapp.Dtos.Message;
using chatapp.Helpers;
using chatapp.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoppingProject.Dtos.JoinedChat;
using ShoppingProject.Repositories;
using System.Security.Claims;

namespace chatapp.Controllers
{
    [ApiController]
    [Route("api/chats")]
    [Authorize]
    public class JoinedChatController : Controller
    {
        private readonly JoinedChatGroupRepository _joinedChatGroupRepository;
        private readonly ChatGroupRepository _chatGroupRepository;
        private readonly UserRepository _userRepository;
        public JoinedChatController(JoinedChatGroupRepository joinedChatGroupRepository, ChatGroupRepository chatGroupRepository, UserRepository userRepository)
        {
            _joinedChatGroupRepository = joinedChatGroupRepository;
            _chatGroupRepository = chatGroupRepository;
            _userRepository = userRepository;
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

        [HttpPost("invite")]
        public async Task<IActionResult> InviteUser(InviteToChatDto dto, CancellationToken ct)
        {
            // check if the owner of the chatgroup is the user logged in
            var loggedUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (loggedUserId == null) return BadRequest("You are not logged in"); 

            var owner = await _chatGroupRepository.getOwnerAsync(dto.ChatGroupId, ct);
            var user = await _userRepository.GetUserByUsernameAsync(dto.UserName, ct);

            if(owner == null) return BadRequest("Chat Group does not exist");
            if(user == null) return BadRequest("User does not exist");

            if(owner!.Id != loggedUserId)
            {
                return BadRequest("You are not the owner of this chat group");
            }

            var joined = new CreateJoinedChatDto
            {
                ChatGroupId = dto.ChatGroupId,
                IsAccepted = false,
                IsAdmin = false,
                IsBanned = false,
                UserId = user.Id
            };

            var result = await _joinedChatGroupRepository.createOneAsync(joined, ct);

            if(result == null) return BadRequest("It was not possible to invite the user to the chat group");

            return Ok(result);
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

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var joinedChat = await _joinedChatGroupRepository.getOneAsync(updateChatGroupDto.Id, ct);

            if (joinedChat == null) return BadRequest("Invite does not exist");

            if (joinedChat.UserId != userId)
            {
                return BadRequest("This invite is not for you");
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