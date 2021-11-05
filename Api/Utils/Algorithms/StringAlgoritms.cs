namespace Api.Utils.Algorithms
{
    public static class StringAlgorithms
    {
        /// <summary>
        /// Implementation of the Knuth-Morris-Pratt algorithm
        /// </summary>
        /// <returns></returns>
        public static bool KMPContains(string text, string pattern, int[] prefixFunction)
        {
            int j = 0;
            for (int i = 0; i < text.Length; i++) {
                while (j > 0 && text[i] != pattern[j]) {
                    j = prefixFunction[j - 1];
                }
                
                if (text[i] == pattern[j]) {
                    j += 1;
                }
                
                if (j == pattern.Length) {
                    return true;
                }
            }

            return false;
        }

        /// <summary>
        /// Implementation of the Knuth-Morris-Pratt algorithm
        /// </summary>
        /// <returns></returns>
        public static bool KMPContains(string text, string pattern)
        {
            return KMPContains(text, pattern, CalcPrefixFunction(pattern));
        }

        public  static int[] CalcPrefixFunction(string str)
        {
            int[] prefixFunc = new int[str.Length];

            for (int i = 1; i < str.Length; i++)
            {
                int j = prefixFunc[i - 1];

                while (j > 0 && str[i] != str[j])
                {
                    j = prefixFunc[j - 1];
                }

                if (str[i] == str[j])
                {
                    j += 1;
                }

                prefixFunc[i] = j;
            }

            return prefixFunc;
        }
    }
}