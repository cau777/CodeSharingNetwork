using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.DatabaseContexts
{
    public class DatabaseContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<CodeSnippet> CodeSnippets { get; set; }
        public DbSet<Like> Likes { get; set; }
        
        public DatabaseContext(DbContextOptions options) : base(options)
        { }
    }
}