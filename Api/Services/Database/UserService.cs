using System.Collections.Generic;
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
            _namesInUse = new HashSet<string>(ItemSet.Select(o => o.Username));
        }

        public bool ContainsName(string name)
        {
            return _namesInUse.Contains(name);
        }

        public override async Task<bool> Add([NotNull] User element)
        {
            bool result = await base.Add(element);
            if (result) _namesInUse.Add(element.Username);
            return result;
        }

        public async Task<bool> EditByUsername([NotNull] string username,
            Optional<string> name = default,
            Optional<byte[]> password = default,
            Optional<byte[]> image = default,
            Optional<string> bio = default)
        {
            User user = await FindByUsername(username);
            if (user is null) return false;

            if (name.HasValue) user.Name = name.Value;
            if (password.HasValue) user.Password = password.Value;
            if (image.HasValue) user.ImageBytes = image.Value;
            if (bio.HasValue) user.Bio = bio.Value;

            return await Edit(user);
        }

        [ItemCanBeNull]
        public Task<User> FindByLogin([NotNull] string username, [NotNull] string password)
        {
            byte[] passwordBytes = User.EncodePassword(password);
            return ItemSet.FirstOrDefaultAsync(o => o.Username == username && o.Password.SequenceEqual(passwordBytes));
        }

        [ItemCanBeNull]
        public Task<User> FindByUsername([NotNull] string username)
        {
            return ItemSet.FirstOrDefaultAsync(o => o.Username == username);
        }

        /// <summary>
        /// Find users that contains the query in the Name or Username
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        public async Task<SearchResult[]> SearchUsers([NotNull] string query)
        {
            string lowerQuery = query.ToLower();
            return await ItemSet
                .Where(o => o.Name.ToLower().Contains(lowerQuery) || o.Username.ToLower().Contains(lowerQuery))
                .Select(o => new SearchResult(o.Username, o.Name))
                .ToArrayAsync();
        }

        public class SearchResult
        {
            public string Username { get; }
            public string Name { get; }

            public SearchResult(string username, string name)
            {
                Username = username;
                Name = name;
            }
        }
    }
}