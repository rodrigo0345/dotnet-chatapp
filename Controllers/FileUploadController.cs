using Microsoft.AspNet.SignalR;
using Microsoft.AspNetCore.Mvc;
using ShoppingProject.Dtos.File;
using ShoppingProject.Interfaces;
using ShoppingProject.Interfaces;

namespace ShoppingProject.Controllers
{

    [ApiController]
    [Route("api/file")]
    [Authorize]
    public class FileUploadController: Controller
    {
        private readonly IStorageService _storageService;
        public FileUploadController(IStorageService fileUploadRepository)
        {
            _storageService = fileUploadRepository;
        }

        [HttpPost, DisableRequestSizeLimit]
        public async Task<IActionResult> UploadFile([FromForm] CreateFileDto file, CancellationToken ct) {
            if (file == null || file.File.Length == 0)
            {
                return BadRequest("Invalid file");
            }

            try
            {
                if (file.File.OpenReadStream().Length == 0)
                {
                    return BadRequest("Empty file stream");
                }

                // Convert IFormFile to byte[]
                var fileDto = new FileDto
                {
                    GroupId = file.GroupId,
                    Extension = Path.GetExtension(file.File.FileName).TrimStart('.'),
                    Stream =file.File
                };

                var response = await _storageService.UploadAsync(fileDto, ct);

                // Handle the response as needed
                if (response.Success)
                {
                    return Ok(response.Content);
                }
                else
                {
                    return BadRequest(response.ErrorMessage);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
