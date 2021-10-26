using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.DatabaseContexts;
using Api.Models;
using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Api.Services.Database
{
    public class CodeSnippetService : LongIdDatabaseService<CodeSnippet>
    {
        public override IQueryable<CodeSnippet> IncludingAll => ItemSet
            .Include(o => o.Author);

        public CodeSnippetService(DatabaseContext context, ILogger<CodeSnippetService> logger) : base(context,
            context.CodeSnippets, logger) { }

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
    }
}