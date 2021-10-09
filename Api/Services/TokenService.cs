using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Api.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Api.Services
{
    public class TokenService
    {
        private readonly byte[] _keyBytes;
        public TokenService(IConfiguration configuration)
        {
            _keyBytes = Encoding.ASCII.GetBytes(configuration["Security:JwtKey"]);
        }

        /// <summary>
        /// Generates a JWT token to authenticate a user
        /// </summary>
        /// <param name="user">The user to generate the token</param>
        /// <returns>The generated token as a string</returns>
        public string GenerateToken(User user)
        {
            DateTime expiringDate = DateTime.UtcNow.AddHours(4);
            JwtSecurityTokenHandler handler = new();
            SecurityTokenDescriptor descriptor = new()
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.Name),
                }),
                Expires = expiringDate,
                SigningCredentials =
                    new SigningCredentials(new SymmetricSecurityKey(_keyBytes), SecurityAlgorithms.HmacSha256Signature)
            };
            SecurityToken token = handler.CreateToken(descriptor);
            return handler.WriteToken(token);
        }
    }
}