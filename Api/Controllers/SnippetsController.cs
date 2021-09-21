using System.Linq;
using System.Threading.Tasks;
using Api.Controllers.DataTransferObjects;
using Api.Models;
using Api.Services;
using Api.Services.Database;
using Api.Utils.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/snippets")]
    public class SnippetsController : Controller
    {
        private readonly CodeSnippetService _codeSnippetService;
        private readonly UserService _userService;

        public SnippetsController(CodeSnippetService codeSnippetService, UserService userService)
        {
            _codeSnippetService = codeSnippetService;
            _userService = userService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetSnippets()
        {
            return Json(_codeSnippetService.Elements.ToList());
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> PostSnippet([FromBody] PostSnippetDTO data)
        {
            User user = await _userService.FindByName(User.GetName());
            if (user is null) return BadRequest();

            bool result = await _codeSnippetService.Add(new CodeSnippet
            {
                Author = user,
                Title = data.Title,
                Description = data.Description,
                Code = data.Code,
                LikeCount = 0
            });

            return result ? Ok() : BadRequest();
        }
    }
}