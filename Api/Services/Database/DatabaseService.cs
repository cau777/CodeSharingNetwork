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
        /// <summary>
        /// IEnumerable of all element in the table
        /// </summary>
        public IEnumerable<T> Elements => IncludingAll;
        
        /// <summary>
        /// IQueryable including values from related tables. Example: Author.Name of CodeSnippet
        /// </summary>
        public virtual IQueryable<T> IncludingAll => ItemSet;

        protected readonly DbSet<T> ItemSet;
        protected readonly DatabaseContext Context;
        private readonly ILogger<DatabaseService<T>> _logger;
        
        /// <summary>
        /// Table name to write on logs
        /// </summary>
        private readonly string _tableName;

        protected DatabaseService(DatabaseContext context, DbSet<T> itemSet, ILogger<DatabaseService<T>> logger)
        {
            ItemSet = itemSet;
            _logger = logger;
            Context = context;
            _tableName = typeof(T).Name + "s";
        }

        /// <summary>
        /// Adds an element to the table and logs the operation
        /// </summary>
        /// <param name="element">The element to add</param>
        /// <returns>True if the operation was successful</returns>
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

        /// <summary>
        /// Removes an element from the table and logs the operation
        /// </summary>
        /// <param name="element">The element to remove</param>
        /// <returns>True if the operation was successful</returns>
        public virtual async Task<bool> Remove([NotNull] T element)
        {
            try
            {
                ItemSet.Remove(element);
                await Context.SaveChangesAsync();
                LogSuccess("REMOVE", element);
                return true;
            }
            catch (Exception e)
            {
                LogFailure("REMOVE", element, e);
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
            // Joins messages from all inner exceptions
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