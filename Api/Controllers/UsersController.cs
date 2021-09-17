﻿using System.Threading.Tasks;
using Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/users")]
    public class UsersController : Controller
    {
        private readonly IContainsUserChecker _containsUserChecker;
        public UsersController(IContainsUserChecker containsUserChecker)
        {
            _containsUserChecker = containsUserChecker;
        }

        [HttpPost]
        [Route("isAvailable")]
        public async Task<IActionResult> IsAvailable([FromBody] string name)
        {
            return Json(!_containsUserChecker.ContainsName(name));
        }
    }
}