using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.DatabaseContexts;
using Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Api.Services
{
    public class UserService : DatabaseService<User>, IContainsUserChecker
    {
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
                LogFailure("ADD", element, e.InnerException?.Message);
                return false;
            }
        }

        public Task<User> FindByLogin(string name, string password)
        {
            byte[] passwordBytes = User.EncodePassword(password);
            return ItemSet.FirstOrDefaultAsync(o => o.Name == name && o.Password.SequenceEqual(passwordBytes));
        }
    }
}