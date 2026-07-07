using TaskFlow.Application.DTOs.Auth;
using TaskFlow.Application.DTOs.Comments;
using TaskFlow.Application.DTOs.Dashboard;
using TaskFlow.Application.DTOs.Profile;
using TaskFlow.Application.DTOs.Projects;
using TaskFlow.Application.DTOs.Tasks;
using TaskFlow.Domain.Entities;
using TaskFlow.Domain.Enums;

namespace TaskFlow.Application.Mappings;

public static class EntityMapper
{
    public static UserDto ToDto(this User user) => new(
        user.Id,
        user.Name,
        user.Surname,
        user.Email,
        user.Role.ToString(),
        user.AvatarUrl,
        user.CreatedDate);

    public static ProjectDto ToDto(this Project project)
    {
        var total = project.Tasks.Count;
        var completed = project.Tasks.Count(t => t.Status == TaskItemStatus.Completed);
        var progress = total == 0 ? 0 : Math.Round((double)completed / total * 100, 1);

        return new ProjectDto(
            project.Id,
            project.Name,
            project.Description,
            project.Status.ToString(),
            project.CreatedDate,
            project.UpdatedDate,
            project.OwnerId,
            $"{project.Owner.Name} {project.Owner.Surname}",
            total,
            completed,
            progress);
    }

    public static ProjectDetailDto ToDetailDto(this Project project)
    {
        var total = project.Tasks.Count;
        var completed = project.Tasks.Count(t => t.Status == TaskItemStatus.Completed);
        var progress = total == 0 ? 0 : Math.Round((double)completed / total * 100, 1);

        return new ProjectDetailDto(
            project.Id,
            project.Name,
            project.Description,
            project.Status.ToString(),
            project.CreatedDate,
            project.UpdatedDate,
            project.OwnerId,
            $"{project.Owner.Name} {project.Owner.Surname}",
            project.Members.Select(m => new ProjectMemberDto(
                m.UserId,
                m.User.Name,
                m.User.Surname,
                m.User.Email,
                m.JoinedDate)),
            total,
            completed,
            progress);
    }

    public static TaskDto ToDto(this TaskItem task) => new(
        task.Id,
        task.Title,
        task.Description,
        task.Priority.ToString(),
        task.Status.ToString(),
        task.DueDate,
        task.CreatedDate,
        task.UpdatedDate,
        task.ProjectId,
        task.Project?.Name ?? string.Empty,
        task.AssignedUserId,
        task.AssignedUser != null ? $"{task.AssignedUser.Name} {task.AssignedUser.Surname}" : null,
        task.Comments?.Count ?? 0);

    public static TaskSummaryDto ToSummaryDto(this TaskItem task) => new(
        task.Id,
        task.Title,
        task.Status.ToString(),
        task.Priority.ToString(),
        task.DueDate,
        task.Project?.Name ?? string.Empty,
        task.AssignedUser != null ? $"{task.AssignedUser.Name} {task.AssignedUser.Surname}" : null,
        task.CreatedDate);

    public static CommentDto ToDto(this TaskComment comment) => new(
        comment.Id,
        comment.Comment,
        comment.CreatedDate,
        comment.TaskId,
        comment.UserId,
        $"{comment.User.Name} {comment.User.Surname}");

    public static ProfileDto ToProfileDto(this User user, int assignedCount, int completedCount) => new(
        user.Id,
        user.Name,
        user.Surname,
        user.Email,
        user.Role.ToString(),
        user.AvatarUrl,
        user.CreatedDate,
        assignedCount,
        completedCount);

    public static TaskItemStatus ParseTaskStatus(string status) =>
        Enum.TryParse<TaskItemStatus>(status, true, out var result)
            ? result
            : throw new ArgumentException($"Geçersiz görev durumu: {status}");

    public static TaskPriority ParseTaskPriority(string priority) =>
        Enum.TryParse<TaskPriority>(priority, true, out var result)
            ? result
            : throw new ArgumentException($"Geçersiz öncelik: {priority}");

    public static ProjectStatus ParseProjectStatus(string status) =>
        Enum.TryParse<ProjectStatus>(status, true, out var result)
            ? result
            : throw new ArgumentException($"Geçersiz proje durumu: {status}");

    public static UserRole ParseUserRole(string role) =>
        Enum.TryParse<UserRole>(role, true, out var result)
            ? result
            : throw new ArgumentException($"Geçersiz rol: {role}");
}
