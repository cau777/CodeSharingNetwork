using System;
using System.Text;
using System.Threading.Tasks;
using JetBrains.Annotations;

namespace Api.Services
{
    public class KeyTermsExtractor
    {
        private const int DefaultCount = 15;
        private const string FileName = @"Data\KeywordsDataset.json";

        public async Task<string[]> ExtractKeywords([NotNull] string text, bool save)
        {
            PythonRunner runner = new("key_terms_extractor");
            byte[] textBytes = Encoding.Default.GetBytes(text);
            string base64 = Convert.ToBase64String(textBytes);

            PythonRunner.Result result = await runner.RunAsync(
                ("text", base64),
                ("count", DefaultCount + ""),
                ("dataset", FileName),
                ("save", save ? "1" : "0"));
            
            if (result.Error.Length > 1) throw new Exception(result.Error);
            return result.Output.Split(' ');
        }
    }
}