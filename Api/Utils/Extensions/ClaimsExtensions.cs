using System.Security.Claims;
using JetBrains.Annotations;

namespace Api.Utils.Extensions
{
    public static class ClaimsExtensions
    {
        /// <summary>
        /// Extension method to find the username of the ClaimsPrincipal
        /// </summary>
        /// <param name="o">The ClaimsPrincipal to search</param>
        /// <returns>The username</returns>
        [NotNull]
        public static string GetName(this ClaimsPrincipal o)
        {
            return o.FindFirstValue(ClaimTypes.Name);
        }
    }
}