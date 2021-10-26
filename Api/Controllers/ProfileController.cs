using System;
using System.IO;
using System.Drawing;
using Api.Utils.Extensions;
using Api.Services.Database;
using System.Drawing.Imaging;
using System.Globalization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Api.Controllers
{
    [Route("api/profile")]
    public class ProfileController : Controller
    {
        private const int ImageSize = 128;

        private readonly UserService _userService;
        private readonly ILogger<ProfileController> _logger;

        public ProfileController(UserService userService, ILogger<ProfileController> logger)
        {
            _userService = userService;
            _logger = logger;
        }
        
        [HttpDelete]
        [Authorize]
        [Route("image")]
        public async Task<IActionResult> DeleteProfileImage()
        {
            bool result = await _userService.EditByName(User.GetName(), newImage: null);
            return result ? NoContent() : BadRequest();
        }

        [HttpPost]
        [Authorize]
        [Route("image")]
        public async Task<IActionResult> UpdateProfileImage([FromForm] IFormFile file, [FromForm] string top,
            [FromForm] string left, [FromForm] string scale)
        {
            double topValue = double.Parse(top, CultureInfo.InvariantCulture);
            double leftValue = double.Parse(left, CultureInfo.InvariantCulture);
            double scaleValue = double.Parse(scale, CultureInfo.InvariantCulture);
            
            try
            {
                await using Stream inputStream = file.OpenReadStream();

                Bitmap bitmap;
                int viewSize;
                int scaledTop;
                int scaledLeft;
                Bitmap cutBitmap;
                Bitmap scaledBitmap;

                using (Image image = Image.FromStream(inputStream))
                {
                    double ratio = scaleValue / 100.0;

                    viewSize = (int) (image.Height / ratio);
                    scaledTop = (int) (topValue * image.Height / ratio);
                    scaledLeft = (int) (leftValue * image.Height / ratio);

                    bitmap = new Bitmap(image);
                }

                using (bitmap)
                {
                    Rectangle rectangle = new(scaledLeft, scaledTop, viewSize, viewSize);
                    _logger.LogInformation("Processing image request with dimensions {Rectangle}", rectangle);
                    cutBitmap = bitmap.Clone(rectangle, PixelFormat.Format32bppArgb);
                }

                using (cutBitmap)
                {
                    scaledBitmap = new Bitmap(cutBitmap, ImageSize, ImageSize);
                }

                using (scaledBitmap)
                {
                    await using MemoryStream outputStream = new();
                    scaledBitmap.Save(outputStream, ImageFormat.Png);
                    await _userService.EditByName(User.GetName(), newImage: outputStream.ToArray());
                }

                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest();
            }
        }
    }
}