using JetBrains.Annotations;

namespace Api.Utils.Extensions
{
    public static class StringExtensions
    {
        /// <summary>
        /// Removes a suffix from a string if present
        /// </summary>
        /// <param name="o"></param>
        /// <param name="suffix"></param>
        /// <returns></returns>
        public static string RemoveSuffix(this string o, [NotNull] string suffix)
        {
            return o.EndsWith(suffix) ? o[..^suffix.Length] : o;
        }
    }
}