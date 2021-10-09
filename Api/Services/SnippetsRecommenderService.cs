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

        /// <summary>
        /// Finds the ids of the most relevant posts of the time period. Right now, it only sorts the by their date,
        /// but in the future it'll consider the user's favorite language and topics
        /// </summary>
        /// <param name="start">The start of the time period to search</param>
        /// <param name="end">The end of the time period to search</param>
        /// <param name="user">The user that is requesting the snippets</param>
        /// <returns>An array with the most relevant posts of the time period</returns>
        public async Task<long[]> RecommendSnippets(DateTime start, DateTime end, User user)
        {
            CodeSnippet[] snippets = await _snippetsService.IncludingAll
                .Where(o => o.Posted >= start)
                .Where(o => o.Posted < end)
                .Where(o => o.Author != user) //Don't recommend the user's own posts
                .ToArrayAsync();

            long[] newPage = snippets
                .OrderByDescending(o => CalcSnippetScore(o, end))
                .Select(o => o.Id)
                .Take(SnippetsPerPage)
                .ToArray();

            return newPage;
        }
    }
}