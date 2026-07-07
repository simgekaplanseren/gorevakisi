using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using TaskFlow.Application.Interfaces.Repositories;
using TaskFlow.Application.Interfaces.Services;
using TaskFlow.Application.Services;
using TaskFlow.Domain.Entities;
using TaskFlow.Domain.Enums;
using TaskFlow.Infrastructure.Data;
using TaskFlow.Infrastructure.Repositories;
using TaskFlow.Infrastructure.Services;

namespace TaskFlow.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        string connectionString)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(connectionString));

        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<ITokenService, TokenService>();

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IProjectService, ProjectService>();
        services.AddScoped<ITaskService, TaskService>();
        services.AddScoped<ICommentService, CommentService>();
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IProfileService, ProfileService>();

        return services;
    }

    public static async Task SeedDatabaseAsync(this IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<ApplicationDbContext>>();

        try
        {
            await context.Database.MigrateAsync();
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex,
                "Veritabanı migration atlandı. SQL Server bağlantısını kontrol edin.");
            return;
        }

        if (await context.Users.AnyAsync()) return;

        var admin = new User
        {
            Name = "Admin",
            Surname = "User",
            Email = "admin@taskflow.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Role = UserRole.Admin
        };

        var demoUser = new User
        {
            Name = "Demo",
            Surname = "Kullanıcı",
            Email = "user@taskflow.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"),
            Role = UserRole.User
        };

        context.Users.AddRange(admin, demoUser);
        await context.SaveChangesAsync();

        var project = new Project
        {
            Name = "TaskFlow MVP",
            Description = "Staj portföyü için demo proje",
            OwnerId = admin.Id,
            UpdatedDate = DateTime.UtcNow
        };

        context.Projects.Add(project);
        await context.SaveChangesAsync();

        context.ProjectMembers.Add(new ProjectMember
        {
            ProjectId = project.Id,
            UserId = demoUser.Id
        });

        context.Tasks.AddRange(
            new TaskItem
            {
                Title = "Backend API geliştir",
                Description = "ASP.NET Core Web API ile REST endpoint'leri oluştur",
                Priority = TaskPriority.High,
                Status = TaskItemStatus.Completed,
                ProjectId = project.Id,
                AssignedUserId = admin.Id,
                DueDate = DateTime.UtcNow.AddDays(-2),
                UpdatedDate = DateTime.UtcNow
            },
            new TaskItem
            {
                Title = "Frontend arayüzü tasarla",
                Description = "React + Material UI ile kullanıcı arayüzü",
                Priority = TaskPriority.Medium,
                Status = TaskItemStatus.InProgress,
                ProjectId = project.Id,
                AssignedUserId = demoUser.Id,
                DueDate = DateTime.UtcNow.AddDays(3),
                UpdatedDate = DateTime.UtcNow
            },
            new TaskItem
            {
                Title = "Kanban board entegrasyonu",
                Description = "Sürükle-bırak Kanban panosu",
                Priority = TaskPriority.High,
                Status = TaskItemStatus.ToDo,
                ProjectId = project.Id,
                AssignedUserId = demoUser.Id,
                DueDate = DateTime.UtcNow.AddDays(7),
                UpdatedDate = DateTime.UtcNow
            });

        await context.SaveChangesAsync();
    }
}
