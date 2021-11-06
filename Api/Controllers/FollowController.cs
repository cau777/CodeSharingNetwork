using System.Threading.Tasks;
using Api.Models;
using Api.Services.Database;
using Api.Utils.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/follow")]
    public class FollowsController : Controller
    {
        private readonly FollowService _followService;
        private readonly UserService _userService;
        
        public FollowsController(FollowService followService, UserService userService)
        {
            _followService = followService;
            _userService = userService;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Follow([FromBody] string other)
        {
            User origin = await _userService.FindByUsername(User.GetUsername());
            User target = await _userService.FindByUsername(other);

            if (origin is null || target is null) return NotFound(other);

            bool result = await _followService.Add(new Follow
            {
                Origin = origin,
                Target = target,
            });

            return result ? Ok() : BadRequest();
        }

        [HttpPost]
        [Authorize]
        [Route("unfollow")]
        public async Task<IActionResult> Unfollow([FromBody] string other)
        {
            User origin = await _userService.FindByUsername(User.GetUsername());
            User target = await _userService.FindByUsername(other);

            if (origin is null || target is null) return NotFound(other);

            bool result = await _followService.RemoveByOriginAndTarget(origin, target);
            return result ? Ok() : BadRequest();
        }
        
        [HttpPost]
        [Authorize]
        [Route("check")]
        public async Task<IActionResult> IsFollowing([FromBody] string other)
        {
            User origin = await _userService.FindByUsername(User.GetUsername());
            User target = await _userService.FindByUsername(other);

            if (origin is null || target is null) return NotFound(other);

            return Json(await _followService.IsFollowing(origin, target));
        }
    }
}