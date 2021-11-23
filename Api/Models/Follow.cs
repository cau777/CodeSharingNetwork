using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Api.Models.Interfaces;

namespace Api.Models
{
    [Table("Follows")]
    public class Follow : ILongIdModel
    {
        [Key]
        public long Id { get; set; }

        public User Origin { get; set; }
        public User Target { get; set; }
    }
}