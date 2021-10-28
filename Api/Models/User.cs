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
        public string Username { get; set; }

        [MaxLength(50)]
        public string Name { get; set; }

        [MaxLength(500)]
        public string Bio { get; set; }

        [MaxLength(32)]
        public byte[] Password { get; set; }

        [Newtonsoft.Json.JsonIgnore, JsonIgnore]
        public byte[] ImageBytes { get; set; }

        [Newtonsoft.Json.JsonIgnore, JsonIgnore]
        [InverseProperty(nameof(CodeSnippet.Author))]
        public List<CodeSnippet> SnippetsPosted { get; set; }

        public User() { }

        public User(string username, string password)
        {
            Username = username;
            Password = EncodePassword(password);
        }

        public static byte[] EncodePassword(string str)
        {
            return SHA256.HashData(Encoding.UTF8.GetBytes(str));
        }
    }
}