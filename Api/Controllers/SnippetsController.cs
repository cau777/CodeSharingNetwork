using System;
using System.Collections.Generic;
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
        [Route("{id:long}")]
        public async Task<IActionResult> GetSnippet(long id)
        {
            CodeSnippet result = await _codeSnippetService.FindById(id);
            
            return result is null ? BadRequest(id) : Json(new GetSnippetDTO
            {
                Id = result.Id,
                Title = result.Title,
                AuthorName = result.Author.Name,
                Description = result.Description,
                Code = result.Code,
                LikeCount = result.LikeCount,
            });
        }

        [HttpGet]
        [Authorize]
        [Route("recommended")]
        public async Task<IActionResult> GetRecommendedSnippets()
        {
            List<CodeSnippet> codeSnippets = _codeSnippetService.Elements.ToList();
            return Json(codeSnippets.Select(o => o.Id));
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> PostSnippet([FromBody] PostSnippetDTO data)
        {
            if (!TryValidateModel(data)) return BadRequest(data);

            User user = await _userService.FindByName(User.GetName());
            if (user is null) return BadRequest();

            bool result = await _codeSnippetService.Add(new CodeSnippet
            {
                Author = user,
                Title = data.Title,
                Description = data.Description,
                Code = data.Code,
                Posted = DateTime.Now,
                LikeCount = 0,
            });

            return result ? Ok() : BadRequest();
        }
    }
}