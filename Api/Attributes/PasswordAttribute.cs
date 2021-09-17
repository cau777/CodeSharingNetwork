using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace Api.Attributes
{
    public class PasswordAttribute : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            Regex numbersRegex = new(".*\\d.*");
            Regex uppercaseRegex = new(".*[A-Z].*");
            Regex lowercaseRegex = new(".*[a-z].*");

            if (value is string str)
                return numbersRegex.IsMatch(str) && uppercaseRegex.IsMatch(str) && lowercaseRegex.IsMatch(str);

            return false;
        }
    }
}