namespace TaskFlow.Application.DTOs.Dashboard;

public record DashboardStatsDto(
    int TotalProjects,
    int TotalTasks,
    int CompletedTasks,
    int InProgressTasks,
    int OverdueTasks,
    int DueTodayTasks,
    IEnumerable<TaskSummaryDto> RecentTasks);

public record TaskSummaryDto(
    int Id,
    string Title,
    string Status,
    string Priority,
    DateTime? DueDate,
    string ProjectName,
    string? AssignedUserName,
    DateTime CreatedDate);

public record NotificationDto(
    string Type,
    string Message,
    int TaskId,
    string TaskTitle,
    DateTime? DueDate);
