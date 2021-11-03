using System.Threading.Tasks;
using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Api.Controllers.DataTransferObjects;
using Api.Services.Database;

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
        public async Task<IActionResult> Login([FromBody] LoginDTO data)
        {
            if (!TryValidateModel(data)) return BadRequest(data);

            User user = await _userService.FindByLogin(data.Username, data.Password);
            if (user is null) return NotFound();

            return Json(PrepareToken(user));
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO data)
        {
            if (!TryValidateModel(data)) return BadRequest(data);

            User user = new(data.Username, data.Password);
            bool result = await _userService.Add(user);

            if (result)
                return Json(PrepareToken(user));
            return Conflict();
        }

        private object PrepareToken(User user)
        {
            return _tokenService.GenerateToken(user);
        }
    }
}