using TaskFlow.Application.DTOs.Dashboard;
using TaskFlow.Application.Interfaces.Repositories;
using TaskFlow.Application.Interfaces.Services;
using TaskFlow.Application.Mappings;
using TaskFlow.Domain.Enums;

namespace TaskFlow.Application.Services;

public class DashboardService(IUnitOfWork unitOfWork) : IDashboardService
{
    public async Task<DashboardStatsDto> GetStatsAsync(int userId, string role)
    {
        IEnumerable<Domain.Entities.TaskItem> tasks;

        if (role == UserRole.Admin.ToString())
        {
            tasks = await unitOfWork.Tasks.GetAllAsync();
        }
        else
        {
            tasks = await unitOfWork.Tasks.GetFilteredAsync(
                null, null, null, null, null, null, userId);
        }

        var taskList = tasks.ToList();
        var projects = role == UserRole.Admin.ToString()
            ? await unitOfWork.Projects.GetAllAsync()
            : (await unitOfWork.Projects.GetAllWithDetailsAsync())
                .Where(p => p.OwnerId == userId || p.Members.Any(m => m.UserId == userId));

        var today = DateTime.UtcNow.Date;

        return new DashboardStatsDto(
            projects.Count(),
            taskList.Count,
            taskList.Count(t => t.Status == TaskItemStatus.Completed),
            taskList.Count(t => t.Status == TaskItemStatus.InProgress),
            taskList.Count(t =>
                t.DueDate.HasValue &&
                t.DueDate.Value.Date < today &&
                t.Status != TaskItemStatus.Completed),
            taskList.Count(t =>
                t.DueDate.HasValue &&
                t.DueDate.Value.Date == today &&
                t.Status != TaskItemStatus.Completed),
            (await unitOfWork.Tasks.GetRecentAsync(5)).Select(t => t.ToSummaryDto()));
    }

    public async Task<IEnumerable<NotificationDto>> GetNotificationsAsync(int userId, string role)
    {
        var assignedUserId = role == UserRole.Admin.ToString() ? (int?)null : userId;

        var tasks = await unitOfWork.Tasks.GetFilteredAsync(
            null, null, null, null, null, null, assignedUserId);

        var today = DateTime.UtcNow.Date;
        var notifications = new List<NotificationDto>();

        foreach (var task in tasks.Where(t => t.Status != TaskItemStatus.Completed && t.DueDate.HasValue))
        {
            if (task.DueDate!.Value.Date < today)
            {
                notifications.Add(new NotificationDto(
                    "overdue",
                    $"'{task.Title}' görevi gecikmiş!",
                    task.Id,
                    task.Title,
                    task.DueDate));
            }
            else if (task.DueDate.Value.Date == today)
            {
                notifications.Add(new NotificationDto(
                    "due_today",
                    $"'{task.Title}' görevi bugün teslim edilmeli!",
                    task.Id,
                    task.Title,
                    task.DueDate));
            }
            else if (task.DueDate.Value.Date <= today.AddDays(3))
            {
                notifications.Add(new NotificationDto(
                    "upcoming",
                    $"'{task.Title}' görevinin teslim tarihi yaklaşıyor.",
                    task.Id,
                    task.Title,
                    task.DueDate));
            }
        }

        return notifications.OrderBy(n => n.DueDate);
    }
}
