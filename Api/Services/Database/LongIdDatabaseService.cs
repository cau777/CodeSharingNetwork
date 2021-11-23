using System.Threading.Tasks;
using Api.DatabaseContexts;
using Api.Models.Interfaces;
using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Api.Services.Database
{
    public abstract class LongIdDatabaseService<T> : DatabaseService<T> where T : class, ILongIdModel
    {
        protected LongIdDatabaseService(DatabaseContext context, DbSet<T> itemSet,
            ILogger<LongIdDatabaseService<T>> logger) :
            base(context, itemSet, logger) { }

        [ItemCanBeNull]
        public Task<T> FindById(long id)
        {
            return IncludingAll.FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<bool> RemoveById(long id)
        {
            T element = await FindById(id);

            if (element is null) return false;

            return await Remove(element);
        }
    }
}