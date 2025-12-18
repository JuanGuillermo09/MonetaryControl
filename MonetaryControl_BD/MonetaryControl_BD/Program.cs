using Microsoft.EntityFrameworkCore;
using MonetaryControl_BD.Interfaces;
using MonetaryControl_BD.Models;

using MonetaryControl_BD.Repository;
using MonetaryControl_BD.Service;



//using MonetariControl_BD.Data;
using System;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

 //🔹 Inyectamos el DbContext con la cadena de conexión
builder.Services.AddDbContext<AppDbContext>(options =>
   options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//Login
builder.Services.AddScoped<ILoginService, LoginService>();
builder.Services.AddScoped<ILoginRepository, LoginRepository>();

//Login
builder.Services.AddScoped<IChangePasswordService, ChangePasswordService>();
builder.Services.AddScoped<IChangePasswordRepository, ChangePasswordRepository>();


//User
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

//UserRole
builder.Services.AddScoped<IUserRoleService, UserRoleService>();
builder.Services.AddScoped<IUserRoleRepository, UserRoleRepository>();

//Expenses
builder.Services.AddScoped<IExpenseService, ExpenseService>();
builder.Services.AddScoped<IExpenseRepository, ExpenseRepository>();

builder.Services.AddControllers();

// 🔹 Habilitar CORS para Angular (localhost y red local)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins(
            "http://localhost:4200",
            "http://192.168.56.1:4200/login"
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});




// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();


//Conexxion a la BD
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (db.Database.CanConnect())
    {
        Console.WriteLine("✅ Conexión exitosa a SQL Server");
    }
    else
    {
        Console.WriteLine("❌ No se pudo conectar a SQL Server");
    }
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAngular");

//app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
