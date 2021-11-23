using System.ComponentModel.DataAnnotations;

namespace Api.Controllers.DataTransferObjects
{
    public class PostSnippetDTO
    {
        [Required]
        [MaxLength(100)]
        public string Title { get; set; }

        [MaxLength(400)]
        public string Description { get; set; }

        [Required]
        [MaxLength(10_000)]
        public string Code { get; set; }

        [Required]
        [MaxLength(50)]
        public string Language { get; set; }
    }
}