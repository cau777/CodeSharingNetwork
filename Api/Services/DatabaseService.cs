using System;
using System.Threading.Tasks;
using Api.DatabaseContexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Api.Services
{
    public abstract class DatabaseService<T> where T : class
    {
        protected readonly DbSet<T> ItemSet;
        protected readonly DatabaseContext Context;
        private readonly ILogger<DatabaseService<T>> _logger;
        private readonly string _tableName;

        protected DatabaseService(DatabaseContext context, DbSet<T> itemSet, ILogger<DatabaseService<T>> logger)
        {
            ItemSet = itemSet;
            _logger = logger;
            Context = context;
            _tableName = typeof(T).Name.ToLower() + "s";
        }

        public abstract Task<bool> Add(T element);

        protected void LogSuccess(string operation, T element)
        {
            _logger.LogInformation($"Success on operation {operation} on table {_tableName}: {JsonConvert.SerializeObject(element)}");
        }
        
        protected void LogFailure(string operation, T element, string reason)
        {
            _logger.LogWarning($"Failure on operation {operation} on table {_tableName} because {reason}: {JsonConvert.SerializeObject(element)}");
        }
    }
}