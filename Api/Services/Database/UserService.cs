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
    public class UserService : DatabaseService<User>, IContainsUserChecker
    {
        public override IQueryable<User> IncludingAll =>
            ItemSet.Include(o => o.LikesGiven).Include(o => o.SnippetsPosted);
        
        private readonly ISet<string> _namesInUse;

        public UserService(DatabaseContext databaseContext, ILogger<DatabaseService<User>> logger) : base(databaseContext, databaseContext.Users, logger)
        {
            _namesInUse = new HashSet<string>(ItemSet.Select(o => o.Name));
        }

        public bool ContainsName(string name)
        {
            return _namesInUse.Contains(name);
        }

        public override async Task<bool> Add(User element)
        {
            try
            {
                ItemSet.Add(element);
                await Context.SaveChangesAsync();
                _namesInUse.Add(element.Name);
                LogSuccess("ADD", element);
                return true;
            }
            catch (Exception e)
            {
                LogFailure("ADD", element, e);
                return false;
            }
        }

        [ItemCanBeNull]
        public Task<User> FindByLogin([System.Diagnostics.CodeAnalysis.NotNull]string name, [System.Diagnostics.CodeAnalysis.NotNull]string password)
        {
            byte[] passwordBytes = User.EncodePassword(password);
            return ItemSet.FirstOrDefaultAsync(o => o.Name == name && o.Password.SequenceEqual(passwordBytes));
        }

        [ItemCanBeNull]
        public Task<User> FindByName([System.Diagnostics.CodeAnalysis.NotNull]string name)
        {
            return ItemSet.FirstOrDefaultAsync(o => o.Name == name);
        }
    }
}