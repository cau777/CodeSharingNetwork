using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;
using Api.DatabaseContexts;
using Api.Models;
using Api.Utils;
using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Api.Services.Database
{
    public class UserService : DatabaseService<User>, IContainsUserChecker
    {
        public override IQueryable<User> IncludingAll => ItemSet
            .Include(o => o.SnippetsPosted);

        /// <summary>
        /// A set to quickly find whether a name is in use. Probably should be removed if the server runs in multiple instances
        /// </summary>
        private readonly ISet<string> _namesInUse;

        public UserService(DatabaseContext databaseContext, ILogger<UserService> logger) : base(
            databaseContext, databaseContext.Users, logger)
        {
            // Initializes the set with all names from the database
            _namesInUse = new HashSet<string>(ItemSet.Select(o => o.Name));
        }

        public bool ContainsName(string name)
        {
            return _namesInUse.Contains(name);
        }

        public override async Task<bool> Add([NotNull] User element)
        {
            bool result = await base.Add(element);
            if (result) _namesInUse.Add(element.Name);
            return result;
        }
        
        public async Task<bool> EditByName([NotNull] string currentName, 
            Optional<string> name = default, 
            Optional<byte[]> password = default,
            Optional<byte[]> image = default)
        {
            User user = await FindByName(currentName);
            if (user is null) return false;
            
            if (name.HasValue) user.Name = name.Value;
            if (password.HasValue) user.Password = password.Value;
            if (image.HasValue) user.ImageBytes = image.Value;

            return await Edit(user);
        }

        [ItemCanBeNull]
        public Task<User> FindByLogin([NotNull] string name, [NotNull] string password)
        {
            byte[] passwordBytes = User.EncodePassword(password);
            return ItemSet.FirstOrDefaultAsync(o => o.Name == name && o.Password.SequenceEqual(passwordBytes));
        }

        [ItemCanBeNull]
        public Task<User> FindByName([NotNull] string name)
        {
            return ItemSet.FirstOrDefaultAsync(o => o.Name == name);
        }
    }
}