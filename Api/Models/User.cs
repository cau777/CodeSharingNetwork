using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Serialization;

namespace Api.Models
{
    [Table("Users")]
    public class User
    {
        [Key]
        public string Name { get; set; }
        
        [MaxLength(32)]
        public byte[] Password { get; set; }

        [Newtonsoft.Json.JsonIgnore, JsonIgnore]
        [InverseProperty(nameof(CodeSnippet.Author))]
        public List<CodeSnippet> SnippetsPosted { get; set; }

        [Newtonsoft.Json.JsonIgnore, JsonIgnore]
        [InverseProperty(nameof(Like.User))]
        public List<Like> LikesGiven { get; set; }

        public User() { }

        public User(string name, string password)
        {
            Name = name;
            Password = EncodePassword(password);
        }

        public static byte[] EncodePassword(string str)
        {
            return SHA256.HashData(Encoding.UTF8.GetBytes(str));
        }
    }
}