using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/auth")]
    public class AuthController : Controller
    {
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginInfo info)
        {
            if (!TryValidateModel(info)) return BadRequest(info);

            return Json(info);
        }
        
        public class LoginInfo
        {
            [Required]
            public string Username { get;  set; }
            
            [Required]
            public string Password { get;  set; }
        }
    }
}