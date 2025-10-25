using api.Models;
using Microsoft.EntityFrameworkCore;
using PGMTApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddMvc(options =>
{
    options.Filters.Add(typeof(JsonExceptionFilter));
});
builder.Services.AddDbContext<ChatContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection") ??
        "server=localhost;port=3306;database=chat;user=root;password=Betoven2606",
        new MySqlServerVersion(new Version(8, 0, 42)) // ajuste para a sua versão do MySQL
    )
);

var app = builder.Build();

//Scaffold-DbContext "server=localhost;port=3306;database=chat;user=root;password=Betoven2606" Pomelo.EntityFrameworkCore.MySql -OutputDir Models  -Force


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
