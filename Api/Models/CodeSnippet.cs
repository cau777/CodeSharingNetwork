using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Api.Models.Interfaces;

namespace Api.Models
{
    [Table("CodeSnippets")]
    public class CodeSnippet : ILongIdModel
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
        public string Language { get; set; }
        
        [Required]
        public DateTime Posted { get; set; }

        public long LikeCount { get; set; }

        // [Newtonsoft.Json.JsonIgnore, JsonIgnore]
        // [InverseProperty(nameof(Like.Snippet))]
        // public List<Like> Likes { get; set; }
    }
}