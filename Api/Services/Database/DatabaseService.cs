using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using Api.DatabaseContexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Api.Services.Database
{
    public abstract class DatabaseService<T> where T : class
    {
        public IEnumerable<T> Elements => IncludingAll;
        protected virtual IQueryable<T> IncludingAll => ItemSet;
        
        protected readonly DbSet<T> ItemSet;
        protected readonly DatabaseContext Context;
        private readonly ILogger<DatabaseService<T>> _logger;
        private readonly string _tableName;

        protected DatabaseService(DatabaseContext context, DbSet<T> itemSet, ILogger<DatabaseService<T>> logger)
        {
            ItemSet = itemSet;
            _logger = logger;
            Context = context;
            _tableName = typeof(T).Name + "s";
        }

        public virtual async Task<bool> Add([NotNull] T element)
        {
            try
            {
                ItemSet.Add(element);
                await Context.SaveChangesAsync();
                LogSuccess("ADD", element);
                return true;
            }
            catch (Exception e)
            {
                LogFailure("ADD", element, e);
                return false;
            }
        }

        protected void LogSuccess(string operation, T element)
        {
            _logger.LogInformation(
                $"Success on operation {operation} on table {_tableName}: {JsonConvert.SerializeObject(element)}");
        }

        protected void LogFailure(string operation, T element, Exception reason)
        {
            string message = reason.Message;
            Exception inner = reason.InnerException;
            while (inner is not null)
            {
                message += " then " + inner.Message;
                inner = inner.InnerException;
            }

            _logger.LogWarning(
                $"Failure on operation {operation} on table {_tableName} because {message}: {JsonConvert.SerializeObject(element)}");
        }
    }
}