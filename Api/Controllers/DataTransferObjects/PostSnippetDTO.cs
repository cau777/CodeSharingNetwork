using System.ComponentModel.DataAnnotations;

namespace Api.Controllers.DataTransferObjects
{
    public class PostSnippetDTO
    {
        [Required]
        [MaxLength(9999)]
        public string Title { get; set; }
        
        [MaxLength(9999)]
        public string Description { get; set; }
        
        [Required]
        [MaxLength(9999)]
        public string Code { get; set; }
    }
}