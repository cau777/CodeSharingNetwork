﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.DatabaseContexts;
using Api.Models;
using Api.Utils;
using Api.Utils.Algorithms;
using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Api.Services.Database
{
    public class CodeSnippetService : LongIdDatabaseService<CodeSnippet>
    {
        private const int SnippetsPerPage = 10;
        private readonly KeyTermsExtractor _keyTermsExtractor;

        public override IQueryable<CodeSnippet> IncludingAll => ItemSet
            .Include(o => o.Author);

        public CodeSnippetService(DatabaseContext context, ILogger<CodeSnippetService> logger,
            KeyTermsExtractor keyTermsExtractor) : base(context,
            context.CodeSnippets, logger)
        {
            _keyTermsExtractor = keyTermsExtractor;
        }

        public Task<bool> HasElementsBefore(DateTime date)
        {
            return ItemSet.AnyAsync(o => o.Posted < date);
        }

        [ItemNotNull]
        public Task<long[]> FindSnippetsIdsPostedByUser(User user, int page)
        {
            const int snippetsPerPage = 10;
            return ItemSet.Where(o => o.Author == user).OrderByDescending(o => o.Posted).Select(o => o.Id)
                .Skip(page * snippetsPerPage).Take(snippetsPerPage).ToArrayAsync();
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
        [ItemNotNull]
        public async Task<long[]> RecommendSnippets(DateTime start, DateTime end, [NotNull] User user)
        {
            CodeSnippet[] snippets = await ItemSet
                .Where(o => o.Posted >= start)
                .Where(o => o.Posted < end)
                .Where(o => o.Author != user) // Don't recommend the user's own posts
                .ToArrayAsync();

            return snippets
                .OrderByDescending(o => CalcSnippetScore(o, end))
                .Select(o => o.Id)
                .Take(SnippetsPerPage)
                .ToArray();
        }

        [ItemNotNull]
        public async Task<long[]> SearchSnippets([NotNull] string query, int page)
        {
            ISet<string> searchKeyTerms = new HashSet<string>(await _keyTermsExtractor.ExtractKeywords(query, false));
            string[] searchRawTerms = query.ToLower().Split(" ");
            int[][] searchPrefixFunctions = searchRawTerms.Select(StringAlgorithms.CalcPrefixFunction).ToArray();

            return ItemSet
                .Select(o => new SearchSnippetContext(o.Id, o.Title, o.Description, o.Tags))
                .AsEnumerable()
                .AsParallel()
                .Select(o => new
                {
                    Element = o,
                    Score = EvaluateKeyTerms(o, searchKeyTerms) +
                            EvaluateRayTerms(o, searchRawTerms, searchPrefixFunctions),
                })
                .Where(tuple => tuple.Score != 0)
                .OrderByDescending(o => o.Score)
                .Select(o => o.Element.Id)
                .Skip(page * SnippetsPerPage)
                .Take(SnippetsPerPage)
                .ToArray();
        }

        private static int EvaluateRayTerms(SearchSnippetContext codeSnippet, IEnumerable<string> terms,
            IEnumerable<int[]> prefixFunctions)
        {
            string text = codeSnippet.Title.ToLower();
            int result = 0;

            foreach ((string term, int[] prefixFunc) in IterationUtils.Zip(terms, prefixFunctions))
            {
                if (StringAlgorithms.KMPContains(text, term, prefixFunc)) result++;
            }

            return result;
        }

        private static int EvaluateKeyTerms(SearchSnippetContext codeSnippet, ICollection<string> searchKeyTerms)
        {
            return codeSnippet.Tags.Count(searchKeyTerms.Contains);
        }

        private class SearchSnippetContext
        {
            public long Id { get; }
            public string Title { get; }
            public string Description { get; }
            public string[] Tags { get; }

            public SearchSnippetContext(long id, string title, string description, string[] tags)
            {
                Id = id;
                Title = title;
                Description = description;
                Tags = tags;
            }
        }
    }
}