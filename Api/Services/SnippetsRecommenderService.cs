using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Api.Models;
using Api.Services.Database;

namespace Api.Services
{
    public class SnippetsRecommenderService
    {
        private static readonly IDictionary<string, RecommendationHistory> Histories;
        private readonly DatabaseService<CodeSnippet> _snippetsService;

        static SnippetsRecommenderService()
        {
            Histories = new ConcurrentDictionary<string, RecommendationHistory>();

            CancellationTokenSource erasingExpiredHistoryCancellation = new();
            CancellationToken token = erasingExpiredHistoryCancellation.Token;

            Task.Run(async () =>
            {
                while (!token.IsCancellationRequested)
                {
                    await Task.Delay(30_000, token);
                    foreach ((string username, RecommendationHistory history) in Histories)
                        if (history.IsExpired)
                            Histories.Remove(username);
                }
            }, token);
        }

        public SnippetsRecommenderService(DatabaseService<CodeSnippet> snippetsService)
        {
            _snippetsService = snippetsService;
        }

        private static double CalcSnippetScore(CodeSnippet snippet, DateTime historyCreation)
        {
            double minutes = (historyCreation - snippet.Posted).TotalMinutes;
            return minutes * -0.1;
        }

        public void PrepareRecommendations(string username)
        {
            Histories[username] = new RecommendationHistory(username);
        }

        public long[] RecommendSnippets(int page, string username)
        {
            RecommendationHistory history = Histories[username];

            if (history.ContainsPage(page))
            {
                history.ResetExpiring();
                return history.GetPage(page);
            }

            DateTime historyCreation = history.CreationDate;

            long[] newPage = _snippetsService.IncludingAll
                .Where(o => o.Author.Name != username)
                .Where(o => o.Posted < historyCreation)
                .AsEnumerable()
                .OrderByDescending(o => CalcSnippetScore(o, historyCreation))
                .Select(o => o.Id)
                .Where(o => !history.ContainsSnippetId(o))
                .Take(RecommendationHistory.SnippetsPerPage).ToArray();

            history.ResetExpiring();
            history.AddPage(newPage);
            return newPage;
        }
    }
}