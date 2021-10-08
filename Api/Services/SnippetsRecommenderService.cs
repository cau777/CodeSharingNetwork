using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Api.Models;
using Api.Services.Database;
using Microsoft.EntityFrameworkCore;

namespace Api.Services
{
    public class SnippetsRecommenderService
    {
        private const int SnippetsPerPage = 10;
        private readonly CodeSnippetService _snippetsService;

        public SnippetsRecommenderService(CodeSnippetService snippetsService)
        {
            _snippetsService = snippetsService;
        }

        private static double CalcSnippetScore(CodeSnippet snippet, DateTime referenceDateTime)
        {
            double minutes = (referenceDateTime - snippet.Posted).TotalMinutes;
            return minutes * -0.1;
        }

        public async Task<long[]> RecommendSnippets(DateTime start, DateTime end, string username)
        {
            CodeSnippet[] snippets = await _snippetsService.IncludingAll
                .Where(o => o.Posted >= start).Where(o => o.Posted < end)
                .Where(o => o.Author.Name != username)
                .ToArrayAsync();
            
            long[] newPage = snippets
                .OrderBy(o => CalcSnippetScore(o, end))
                .Select(o => o.Id)
                .Take(SnippetsPerPage)
                .ToArray();

            return newPage;
        }
    }
}