using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.DatabaseContexts;
using Api.Models;
using Api.Utils;
using Api.Utils.Algorithms;
using JetBrains.Annotations;
using Microsoft.AspNetCore.Http.Features;
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
            return ItemSet
                .Where(o => o.Author == user)
                .OrderByDescending(o => o.Posted)
                .Select(o => o.Id)
                .Skip(page * SnippetsPerPage)
                .Take(SnippetsPerPage)
                .ToArrayAsync();
        }

        private static double CalcSnippetScore(RecommendingContext context, DateTime referenceDateTime)
        {
            const double minutesWeight = -1;
            const double fromFriendWeight = 120;
            CodeSnippet snippet = context.Snippet;

            double minutes = (referenceDateTime - snippet.Posted).TotalMinutes;
            return minutes * minutesWeight + (context.IsFromFried ? fromFriendWeight : 0);
        }

        /// <summary>
        /// Finds the ids of the most relevant posts of the time period. It finds a score for each post considering date
        /// and whether it was posted by following users
        /// </summary>
        /// <param name="start">The start of the time period to search</param>
        /// <param name="end">The end of the time period to search</param>
        /// <param name="user">The user that is requesting the snippets</param>
        /// <returns>An array with the most relevant posts of the time period</returns>
        [ItemNotNull]
        public async Task<long[]> RecommendSnippets(DateTime start, DateTime end, [NotNull] User user)
        {
            RecommendingContext[] contexts = await Context.Follows // Gets posts posted by following users
                .Include(o => o.Target.SnippetsPosted)
                .Where(o => o.Origin == user)
                .SelectMany(o => o.Target.SnippetsPosted)
                .Where(o => o.Posted >= start)
                .Where(o => o.Posted < end)
                .Where(o => o.Author != user) // Don't recommend the user's own posts
                .Select(o => new RecommendingContext {IsFromFried = true, Snippet = o})
                .Concat(ItemSet // Gets all posts in the time period
                    .Where(o => o.Posted >= start)
                    .Where(o => o.Posted < end)
                    .Where(o => o.Author != user) // Don't recommend the user's own posts
                    .Select(o => new RecommendingContext {IsFromFried = false, Snippet = o})
                )
                .ToArrayAsync();

            // Remove duplicates
            IDictionary<long, RecommendingContext> contextsById = new Dictionary<long, RecommendingContext>();
            foreach (RecommendingContext context in contexts)
                if (contextsById.TryGetValue(context.Snippet.Id, out RecommendingContext currentContext))
                {
                    if (!currentContext.IsFromFried)
                        contextsById[context.Snippet.Id] = context;
                }
                else
                {
                    contextsById[context.Snippet.Id] = context;
                }

            long[] result = contextsById
                .Select(o => o.Value)
                .OrderByDescending(o => CalcSnippetScore(o, end))
                .Select(o => o.Snippet.Id)
                .Take(SnippetsPerPage)
                .ToArray();

            return result;
        }

        private class RecommendingContext
        {
            public bool IsFromFried { get; set; }
            public CodeSnippet Snippet { get; set; }
        }

        /// <summary>
        /// Find snippets that contain words from the query in the title or contain key terms
        /// </summary>
        /// <param name="query"></param>
        /// <param name="page"></param>
        /// <returns></returns>
        [ItemNotNull]
        public async Task<long[]> SearchSnippets([NotNull] string query, int page)
        {
            ISet<string> searchKeyTerms = new HashSet<string>(await _keyTermsExtractor.ExtractKeywords(query, false));
            string[] searchRawTerms = query.ToLower().Split(" ");

            int[][] searchPrefixFunctions = searchRawTerms.Select(StringAlgorithms.CalcPrefixFunction).ToArray();
            return ItemSet
                .Select(o => new SearchSnippetContext(o.Id, o.Title, o.Tags))
                .AsEnumerable()
                .AsParallel()
                .Select(o => new
                {
                    Element = o,
                    Score = EvaluateKeyTerms(o, searchKeyTerms) +
                            EvaluateContent(o, searchRawTerms, searchPrefixFunctions),
                })
                .Where(o => o.Score != 0)
                .OrderByDescending(o => o.Score)
                .Select(o => o.Element.Id)
                .Skip(page * SnippetsPerPage)
                .Take(SnippetsPerPage)
                .ToArray();
        }

        /// <summary>
        /// Counts the search terms in the title of the snippet, using KMP algorithm
        /// </summary>
        /// <param name="codeSnippet"></param>
        /// <param name="terms"></param>
        /// <param name="prefixFunctions"></param>
        /// <returns></returns>
        private static int EvaluateContent(SearchSnippetContext codeSnippet, IEnumerable<string> terms,
            IEnumerable<int[]> prefixFunctions)
        {
            string text = codeSnippet.Title.ToLower();

            int result = 0;
            foreach ((string term, int[] prefixFunc) in IterationUtils.Zip(terms, prefixFunctions))
                if (StringAlgorithms.KMPContains(text, term, prefixFunc))
                    result++;

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
            public string[] Tags { get; }

            public SearchSnippetContext(long id, string title, string[] tags)
            {
                Id = id;
                Title = title;
                Tags = tags;
            }
        }
    }
}