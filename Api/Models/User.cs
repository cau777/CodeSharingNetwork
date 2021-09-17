using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Cryptography;
using System.Text;

namespace Api.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        public string Name { get; set; }
        
        [MaxLength(32)]
        public byte[] Password { get; set; }

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