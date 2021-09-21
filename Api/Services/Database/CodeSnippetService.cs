using System.Collections.Generic;
using Api.DatabaseContexts;
using Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Api.Services.Database
{
    public class CodeSnippetService : DatabaseService<CodeSnippet>
    {
        public override IEnumerable<CodeSnippet> Elements => ItemSet.Include(o => o.Likes).Include(o => o.Author);

        public CodeSnippetService(DatabaseContext context, ILogger<DatabaseService<CodeSnippet>> logger) : base(context,
            context.CodeSnippets, logger) { }
    }
}