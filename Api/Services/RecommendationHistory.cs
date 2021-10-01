using System;
using System.Collections.Generic;

namespace Api.Services
{
    public class RecommendationHistory
    {
        // In order to save memory, delete snippets recommended after they stop using it for 2 hours
        public bool IsExpired => DateTime.Now > _expirationDate;
        public DateTime CreationDate { get; }

        public const int SnippetsPerPage = 10;
        private readonly List<long[]> _generatedPages;
        private readonly ISet<long> _snippetsIds;
        private DateTime _expirationDate;

        public RecommendationHistory(string username)
        {
            CreationDate = DateTime.Now;
            _expirationDate = CreationDate.AddHours(2);
            _generatedPages = new List<long[]>();
            _snippetsIds = new HashSet<long>();
        }

        public bool ContainsPage(int pageIndex)
        {
            return pageIndex < _generatedPages.Count;
        }

        public bool ContainsSnippetId(long id)
        {
            return _snippetsIds.Contains(id);
        }

        public long[] GetPage(int pageIndex)
        {
            return _generatedPages[pageIndex];
        }

        public void AddPage(long[] page)
        {
            _generatedPages.Add(page);
            _snippetsIds.UnionWith(page);
        }

        public void ResetExpiring()
        {
            _expirationDate = DateTime.Now.AddHours(2);
        }
    }
}