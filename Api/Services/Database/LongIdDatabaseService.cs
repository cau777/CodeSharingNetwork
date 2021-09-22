using System.Threading.Tasks;
using Api.DatabaseContexts;
using Api.Models.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Api.Services.Database
{
    public abstract class LongIdDatabaseService<T> : DatabaseService<T> where T : class, ILongIdModel
    {
        protected LongIdDatabaseService(DatabaseContext context, DbSet<T> itemSet, ILogger<DatabaseService<T>> logger) :
            base(context, itemSet, logger) { }

        public Task<T> FindById(long id)
        {
            return ItemSet.FirstOrDefaultAsync(o => o.Id == id);
        }
    }
}