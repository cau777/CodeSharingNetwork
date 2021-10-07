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
            CodeSnippet result = await _codeSnippetService.FindById(id);
            User currentUser = await _userService.FindByName(User.GetName());

            if (currentUser is null) return Unauthorized();

            return result is null
                ? BadRequest(id)
                : Json(new GetSnippetDTO
                {
                    Id = result.Id,
                    Title = result.Title,
                    AuthorName = result.Author.Name,
                    Description = result.Description,
                    Code = result.Code,
                    LikeCount = result.LikeCount,
                    UserLiked = await _likeService.UserLikedSnippet(currentUser, result),
                    Language = result.Language,
                    Posted = result.Posted,
                });
        }

        [HttpPost]
        [Authorize]
        [Route("recommended")]
        public IActionResult PrepareRecommendations()
        {
            string username = User.GetName();
            _snippetsRecommender.PrepareRecommendations(username);
            return Ok();
        }

        [HttpGet]
        [Authorize]
        [Route("recommended/{page:int}")]
        public IActionResult GetRecommendedSnippets(int page)
        {
            string username = User.GetName();
            try
            {
                long[] recommendSnippets = _snippetsRecommender.RecommendSnippets(page, username);
                return Json(recommendSnippets);
            }
            catch (KeyNotFoundException)
            {
                return BadRequest();
            }
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
                Language = data.Language.ToLower(),
            });

            return result ? Ok() : BadRequest();
        }

        [HttpPost]
        [Authorize]
        [Route("{id:long}/like")]
        public async Task<IActionResult> Like(long id)
        {
            User user = await _userService.FindByName(User.GetName());
            CodeSnippet snippet = await _codeSnippetService.FindById(id);
            
            if (user is null) return Unauthorized();
            if (snippet is null) return BadRequest(id);

            bool result = await _likeService.Add(new Like
            {
                Snippet = snippet,
                User = user,
            });

            return result ? Ok() : BadRequest();
        }
        
        [HttpPost]
        [Authorize]
        [Route("{id:long}/unlike")]
        public async Task<IActionResult> Unlike(long id)
        {
            User user = await _userService.FindByName(User.GetName());
            CodeSnippet snippet = await _codeSnippetService.FindById(id);

            if (user is null) return Unauthorized();
            if (snippet is null) return BadRequest(id);
            
            bool result = await _likeService.RemoveByUserAndSnippet(user, snippet);

            return result ? Ok() : BadRequest();
        }
    }
}