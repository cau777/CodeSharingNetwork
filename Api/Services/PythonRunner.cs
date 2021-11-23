using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Api.Utils.Extensions;
using JetBrains.Annotations;

namespace Api.Services
{
    /// <summary>
    /// Utility class to execute python scripts synchronously and asynchronously
    /// </summary>
    public class PythonRunner
    {
        private const string PythonVenvPath = @"Python\venv\Scripts\python.exe";
        private const string PythonPath = @"Python";

        private readonly ProcessStartInfo _psi;
        private readonly string _scriptPath;

        public PythonRunner([NotNull] string scriptName)
        {
            _scriptPath = Path.Join(PythonPath, scriptName + ".py");
            _psi = new ProcessStartInfo
            {
                FileName = PythonVenvPath,
                UseShellExecute = false,
                CreateNoWindow = true,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                StandardOutputEncoding = Encoding.Latin1,
                StandardErrorEncoding = Encoding.Latin1,
            };
        }

        public Result Run([NotNull] params (string, string)[] args)
        {
            _psi.Arguments = $"\"{_scriptPath}\" {CreateArguments(args)}";

            Process process = Process.Start(_psi) ??
                              throw new ArgumentException("Can't create process with the specified arguments");
            return new Result
            {
                Error = process.StandardError.ReadToEnd(),
                Output = process.StandardOutput.ReadToEnd().RemoveSuffix("\r\n"),
            };
        }

        public async Task<Result> RunAsync([NotNull] params (string, string)[] args)
        {
            _psi.Arguments = $"\"{_scriptPath}\" {CreateArguments(args)}";

            Process process = Process.Start(_psi) ??
                              throw new ArgumentException("Can't create process with the specified arguments");

            return new Result
            {
                Error = await process.StandardError.ReadToEndAsync(),
                Output = (await process.StandardOutput.ReadToEndAsync()).RemoveSuffix("\r\n"),
            };
        }

        private static string CreateArguments(IEnumerable<(string, string)> args)
        {
            StringBuilder argsString = new();

            foreach ((string name, string value) in args) argsString.Append($"--{name}=\"{value}\" ");

            return argsString.ToString();
        }

        public class Result
        {
            public string Output { get; init; }
            public string Error { get; init; }
        }
    }
}