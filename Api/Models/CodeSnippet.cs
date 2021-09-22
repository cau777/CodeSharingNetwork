using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Api.Models
{
    [Table("CodeSnippets")]
    public class CodeSnippet
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }
        
        [Required]
        public string Title { get; set; }
    
        [Required]
        public User Author { get; set; }

        public string Description { get; set; }

        [Required]
        public string Code { get; set; }
        
        [Required]
        public DateTime Posted { get; set; }

        public long LikeCount { get; set; }

        [JsonIgnore]
        [InverseProperty(nameof(Like.Snippet))]
        public List<Like> Likes { get; set; }
    }
}