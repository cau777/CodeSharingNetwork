using System.Linq;
using System.Threading.Tasks;
using Api.DatabaseContexts;
using Api.Models;
using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Api.Services.Database
{
    public class FollowService : LongIdDatabaseService<Follow>
    {
        public FollowService(DatabaseContext context, ILogger<FollowService> logger) : base(
            context, context.Follows, logger) { }

        public override IQueryable<Follow> IncludingAll => ItemSet.Include(o => o.Origin).Include(o => o.Target);

        [ItemCanBeNull]
        public Task<Follow> FindByOriginAndTarget([NotNull] User origin, [NotNull] User target)
        {
            return ItemSet.FirstOrDefaultAsync(o => o.Origin == origin && o.Target == target);
        }

        public async Task<bool> IsFollowing([NotNull] User origin, [NotNull] User target)
        {
            return await FindByOriginAndTarget(origin, target) is not null;
        }

        public override async Task<bool> Add([NotNull] Follow element)
        {
            if (element.Origin == element.Target) return false;
            if (await IsFollowing(element.Origin, element.Target)) return false;

            return await base.Add(element);
        }

        public async Task<bool> RemoveByOriginAndTarget([NotNull] User origin, [NotNull] User target)
        {
            Follow found = await FindByOriginAndTarget(origin, target);

            if (found is null) return false;

            return await base.Remove(found);
        }
    }
}