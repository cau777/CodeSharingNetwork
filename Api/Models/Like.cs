using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Api.Models.Interfaces;

namespace Api.Models
{
    [Table("Likes")]
    public class Like : ILongIdModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        public User User { get; set; }
        public CodeSnippet Snippet { get; set; }
    }
}