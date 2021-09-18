using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Api.Attributes;
using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace Api.Controllers
{
    [Route("api/auth")]
    public class AuthController : Controller
    {
        private readonly UserService _userService;
        private readonly TokenService _tokenService;

        public AuthController(UserService userService, TokenService tokenService)
        {
            _userService = userService;
            _tokenService = tokenService;
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginInfo info)
        {
            if (!TryValidateModel(info)) return BadRequest(info);

            User user = await _userService.FindByLogin(info.Name, info.Password);
            if (user is null) return NotFound();

            return Json(PrepareToken(user));
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterInfo info)
        {
            if (!TryValidateModel(info)) return BadRequest(info);

            User user = new(info.Name, info.Password);
            bool result = await _userService.Add(user);

            if (result)
                return Json(PrepareToken(user));
            return Conflict();
        }

        [HttpGet]
        [Authorize]
        [Route("info")]
        public IActionResult GetInfo()
        {
            return Json(User.Claims.Select(o => new { type = o.ValueType, value = o.Value }).ToArray());
        }

        private object PrepareToken(User user)
        {
            return _tokenService.GenerateToken(user);
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