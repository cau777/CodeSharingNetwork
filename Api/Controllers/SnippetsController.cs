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
        private readonly SnippetsRecommenderService _snippetsRecommender;
        private readonly LikeService _likeService;

        public SnippetsController(CodeSnippetService codeSnippetService, UserService userService,
            SnippetsRecommenderService snippetsRecommender, LikeService likeService)
        {
            _codeSnippetService = codeSnippetService;
            _userService = userService;
            _snippetsRecommender = snippetsRecommender;
            _likeService = likeService;
        }

        [HttpGet]
        [Authorize]
        [Route("{id:long}")]
        public async Task<IActionResult> GetSnippet(long id)
        {
            CodeSnippet found = await _codeSnippetService.FindById(id);
            User currentUser = await _userService.FindByName(User.GetName());

            if (currentUser is null) return Unauthorized();
            if (found is null) return BadRequest(id);

            return Json(new GetSnippetDTO
            {
                Id = found.Id,
                Title = found.Title,
                AuthorName = found.Author.Name,
                Description = found.Description,
                Code = found.Code,
                LikeCount = found.LikeCount,
                UserLiked = await _likeService.UserLikedSnippet(currentUser, found),
                Language = found.Language,
                Posted = found.Posted,
            });
        }

        [HttpGet]
        [Authorize]
        [Route("recommended")]
        public async Task<IActionResult> GetRecommendedSnippets([FromQuery] DateTime start,
            [FromQuery] DateTime end)
        {
            string username = User.GetName();
            User currentUser = await _userService.FindByName(username);

            if (currentUser is null) return Unauthorized();

            long[] recommendSnippets = await _snippetsRecommender.RecommendSnippets(start, end, currentUser);

            if (recommendSnippets.Length == 0 &&
                !await _codeSnippetService.HasElementsBefore(end)) // If there are no more snippets in the database
                return NoContent();

            return Json(recommendSnippets);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> PostSnippet([FromBody] PostSnippetDTO data)
        {
            if (!TryValidateModel(data)) return BadRequest(data);

            User currentUser = await _userService.FindByName(User.GetName());
            if (currentUser is null) return Unauthorized();

            bool result = await _codeSnippetService.Add(new CodeSnippet
            {
                Author = currentUser,
                Title = data.Title,
                Description = data.Description,
                Code = data.Code,
                Posted = DateTime.Now,
                LikeCount = 0,
                Language = data.Language.ToLower(),
            });

            return result ? Ok() : BadRequest();
        }

        [HttpPost]
        [Authorize]
        [Route("{id:long}/like")]
        public async Task<IActionResult> Like(long id)
        {
            User currentUser = await _userService.FindByName(User.GetName());
            CodeSnippet snippet = await _codeSnippetService.FindById(id);

            if (currentUser is null) return Unauthorized();
            if (snippet is null) return BadRequest(id);

            bool result = await _likeService.Add(new Like
            {
                Snippet = snippet,
                User = currentUser,
            });

            return result ? Ok() : BadRequest();
        }

        [HttpPost]
        [Authorize]
        [Route("{id:long}/unlike")]
        public async Task<IActionResult> Unlike(long id)
        {
            User currentUser = await _userService.FindByName(User.GetName());
            CodeSnippet snippet = await _codeSnippetService.FindById(id);

            if (currentUser is null) return Unauthorized();
            if (snippet is null) return BadRequest(id);

            bool result = await _likeService.RemoveByUserAndSnippet(currentUser, snippet);

            return result ? Ok() : BadRequest();
        }
    }
}