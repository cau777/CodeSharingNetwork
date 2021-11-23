using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Api.Controllers.DataTransferObjects
{
    public class UserInfoDTO
    {
        [NotNull]
        [MinLength(1)]
        [MaxLength(50)]
        public string Name { get; set; }

        [MaxLength(500)]
        public string Bio { get; set; }
    }
}