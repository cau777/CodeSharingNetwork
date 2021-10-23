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

namespace Api.Controllers
{
    [Route("api/profile")]
    public class ProfileController : Controller
    {
        private const int ImageSize = 128;

        private readonly UserService _userService;

        public ProfileController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost]
        [Authorize]
        [Route("image")]
        public async Task<IActionResult> UpdateProfileImage([FromForm] IFormFile file, [FromForm] string top,
            [FromForm] string left, [FromForm] int scale)
        {
            Console.WriteLine(top + " " + left + " " + scale);
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
                    double ratio = scale / 100.0;
                    viewSize = (int) (image.Height / ratio);
                    scaledTop = (int) (float.Parse(top, CultureInfo.InvariantCulture) * image.Height / ratio);
                    scaledLeft = (int) (float.Parse(left, CultureInfo.InvariantCulture) * image.Height / ratio);

                    bitmap = new Bitmap(image);
                }

                using (bitmap)
                {
                    Rectangle rectangle = new(scaledLeft, scaledTop, viewSize, viewSize);
                    Console.WriteLine(rectangle);
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