using System.Security.Claims;
using JetBrains.Annotations;

namespace Api.Utils.Extensions
{
    public static class ClaimsExtensions
    {
        [NotNull]
        public static string GetName(this ClaimsPrincipal o)
        {
            return o.FindFirstValue(ClaimTypes.Name);
        }
    }
}