using JetBrains.Annotations;

namespace Api.Utils.Extensions
{
    public static class StringExtensions
    {
        public static string RemoveSuffix(this string o, [NotNull] string suffix)
        {
            return o.EndsWith(suffix) ? o[..^suffix.Length] : o;
        }
    }
}