using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Api.Attributes;
using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/auth")]
    public class AuthController : Controller
    {
        private readonly UserService _userService;
        public AuthController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginInfo info)
        {
            if (!TryValidateModel(info)) return BadRequest(info);

            User user = await _userService.FindByLogin(info.Name, info.Password);
            if (user is null) return NotFound();

            return Ok();
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterInfo info)
        {
            if (!TryValidateModel(info)) return BadRequest(info);

            User user = new(info.Name, info.Password);
            bool result = await _userService.Add(user);

            return result ? Ok() : Conflict();
        }

        public class LoginInfo
        {
            [Required]
            [MinLength(4)]
            [RegularExpression("^[\\w]+$")]
            public string Name { get; set; }

            [Required]
            [Password]
            [MinLength(8)]
            public string Password { get; set; }
        }

        public class RegisterInfo : LoginInfo { }
    }
}