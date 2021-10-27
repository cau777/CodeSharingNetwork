using System.ComponentModel.DataAnnotations;
using Api.Attributes;

namespace Api.Controllers.DataTransferObjects
{
    public class LoginDTO
    {
        [Required]
        [MinLength(4)]
        [RegularExpression("^[\\w]+$")]
        public string Username { get; set; }

        [Required]
        [Password]
        [MinLength(8)]
        public string Password { get; set; }
    }
}