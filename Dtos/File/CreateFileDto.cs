using System.ComponentModel.DataAnnotations;

namespace ShoppingProject.Dtos.File
{
    public class CreateFileDto
    {
        [Required]
        public IFormFile File { get; set; } = new FormFile(Stream.Null, 0, 0, "File", "file.txt");

        [Required]
        public Guid GroupId { get; set; } = Guid.NewGuid();
    }
}
