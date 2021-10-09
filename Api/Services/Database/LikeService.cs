using System.Threading.Tasks;
using Api.DatabaseContexts;
using Api.Models;
using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Api.Services.Database
{
    public class LikeService : LongIdDatabaseService<Like>
    {
        public LikeService(DatabaseContext context, ILogger<DatabaseService<Like>> logger) : base(context,
            context.Likes, logger) { }

        [ItemCanBeNull]
        public Task<Like> FindByUserAndSnippet([NotNull] User user, [NotNull] CodeSnippet snippet)
        {
            return ItemSet.FirstOrDefaultAsync(o => o.User == user && o.Snippet == snippet);
        }

        public async Task<bool> UserLikedSnippet([NotNull] User user, [NotNull] CodeSnippet snippet)
        {
            return await FindByUserAndSnippet(user, snippet) is not null;
        }

        public override async Task<bool> Add([NotNull] Like element)
        {
            // A user can't like their own post
            if (element.User == element.Snippet.Author) return false;

            // If the user has already liked
            if (await UserLikedSnippet(element.User, element.Snippet)) return false;

            if (!await base.Add(element)) return false;

            await UpdateLikeCount(element.Snippet);
            return true;
        }

        public override async Task<bool> Remove([NotNull] Like element)
        {
            bool result = await base.Remove(element);
            if (result) await UpdateLikeCount(element.Snippet);
            return result;
        }

        public async Task<bool> RemoveByUserAndSnippet([NotNull] User user, [NotNull] CodeSnippet snippet)
        {
            Like like = await FindByUserAndSnippet(user, snippet);

            if (like is null) return false;

            return await Remove(like);
        }

        private async Task UpdateLikeCount(CodeSnippet snippet)
        {
            snippet.LikeCount = await ItemSet.LongCountAsync(o => o.Snippet == snippet);
            await Context.SaveChangesAsync();
        }
    }
}