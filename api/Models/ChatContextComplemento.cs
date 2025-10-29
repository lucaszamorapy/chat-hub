using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System.Configuration;
using api.Services;

namespace api.Models
{
    public partial class ChatContext
    {
        public IHttpContextAccessor HttpContext { get; }
        protected readonly IConfiguration Configuration;
        public ChatContext(DbContextOptions options, IHttpContextAccessor httpContext, IConfiguration configuration)
            : base(options)
        {
            HttpContext = httpContext;
            Configuration = configuration;
        }

        public override int SaveChanges()
        {
            BeforeSaveChanges().ConfigureAwait(false).GetAwaiter().GetResult();
            var result = base.SaveChanges();
            return result;
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            await BeforeSaveChanges();
            var result = await base.SaveChangesAsync(cancellationToken);
            return result;
        }
        private async Task BeforeSaveChanges()
        {

            var context = HttpContext?.HttpContext;
            var userId = TokenService.GetTokenUserId(context);
            ChangeTracker.DetectChanges();

            foreach (var entry in ChangeTracker.Entries())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        //entry.CurrentValues.Properties.Where(e=>e.FindColumn)
                        entry.Properties.Where(e => e.Metadata.Name == "Regidh").FirstOrDefault().CurrentValue = DateTime.Now;
                        entry.Properties.Where(e => e.Metadata.Name == "Regiusu").FirstOrDefault().CurrentValue = userId;
                        entry.Properties.Where(e => e.Metadata.Name == "Regadh").FirstOrDefault().CurrentValue = DateTime.Now;
                        entry.Properties.Where(e => e.Metadata.Name == "Regausu").FirstOrDefault().CurrentValue = userId;
                        break;
                    case EntityState.Modified:
                        //var p = entry.Properties.Where(e => e.Metadata.Name == "Regadh").FirstOrDefault();
                        entry.Properties.Where(e => e.Metadata.Name == "Regadh").FirstOrDefault().CurrentValue = DateTime.Now;
                        entry.Properties.Where(e => e.Metadata.Name == "Regausu").FirstOrDefault().CurrentValue = userId;
                        entry.Properties.Where(e => e.Metadata.Name == "Regiusu").FirstOrDefault().IsModified = false;
                        entry.Properties.Where(e => e.Metadata.Name == "Regidh").FirstOrDefault().IsModified = false;
                        break;
                }
            }
        }
    }
}
