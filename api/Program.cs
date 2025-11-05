using api.Models;
using api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using PGMTApi.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ---------------------
// 🔧 Configuração de Serviços
// ---------------------

builder.Services.AddControllers().AddNewtonsoftJson(options =>
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
);

builder.Services.AddControllers(options =>
    options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true
);

builder.Services.AddHttpContextAccessor();
builder.Services.AddSignalR();
builder.Services.AddScoped<GeralService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddMvc(options =>
{
    options.Filters.Add(typeof(JsonExceptionFilter));
});

builder.Services.AddDbContext<ChatContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("MySQL"),
        new MySqlServerVersion(new Version(8, 0, 42))
    )
);

// 🧱 CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

// 🔐 JWT
var key = Encoding.ASCII.GetBytes(api.Config.Secret);
builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

builder.Services.AddAuthorization();

// ---------------------
// 🚀 Build e Configuração do Pipeline
// ---------------------

var app = builder.Build();

app.UseCors("AllowAll");

// Cria pastas iniciais
using (var scope = app.Services.CreateScope())
{
    var geralService = scope.ServiceProvider.GetRequiredService<GeralService>();
    geralService.CriarPasta(["usuarios", "conversas"]);
}

app.MapHub<ChatHub>("/chatHub");

// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 📂 Configuração de arquivos estáticos
var caminhoUploads = builder.Configuration["caminhoPasta"];

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(caminhoUploads),
    RequestPath = "/api/uploads"
});

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
