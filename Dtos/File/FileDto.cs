using System.ComponentModel.DataAnnotations;

namespace ShoppingProject.Dtos.File
{
    public class FileDto
    {
        [Required]
        [MinLength(3, ErrorMessage ="Invalid file extension")]
        public string Extension { get; set; } = null!;

        [Required]
        public IFormFile Stream { get; set; } = null!;
        public Guid GroupId { get; set; } = Guid.NewGuid();
    }
}
