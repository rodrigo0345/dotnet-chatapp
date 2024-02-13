using Microsoft.AspNet.SignalR;
using Microsoft.AspNetCore.Mvc;

namespace ShoppingProject.Controllers
{

    [ApiController]
    [Route("api/file")]
    [Authorize]
    public class FileUploadController: Controller
    {
        private readonly FileUploadRepository _fileUploadRepository;
        public FileUploadController(FileUploadRepository fileUploadRepository)
        {
            _fileUploadRepository = fileUploadRepository;
        }
        
        public async Task<IActionResult> UploadFile([FromBody] CreateFileDto createFileDto, CancellationToken ct)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (String.IsNullOrWhiteSpace(createFileDto.OwnerId))
            {
                if (userId == null)
                {
                    return BadRequest("Invalid user");
                }

                // set the owner of the file to the user that is logged in
                createFileDto.OwnerId = userId;
                Console.WriteLine($"Your id: {userId}");
            }

            var result = await _fileUploadRepository.createOneAsync(createFileDto, ct);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(501, "It was not possible to create the file");
        }
    }
}
