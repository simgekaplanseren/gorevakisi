namespace TaskFlow.Application.DTOs.Tasks;

public record CreateTaskRequest(
    string Title,
    string Description,
    string Priority,
    DateTime? DueDate,
    int ProjectId,
    int? AssignedUserId);

public record UpdateTaskRequest(
    string Title,
    string Description,
    string Priority,
    string Status,
    DateTime? DueDate,
    int? AssignedUserId);

public record UpdateTaskStatusRequest(string Status);

public record TaskDto(
    int Id,
    string Title,
    string Description,
    string Priority,
    string Status,
    DateTime? DueDate,
    DateTime CreatedDate,
    DateTime UpdatedDate,
    int ProjectId,
    string ProjectName,
    int? AssignedUserId,
    string? AssignedUserName,
    int CommentCount);

public record TaskFilterRequest(
    string? Search,
    string? Status,
    string? Priority,
    DateTime? DueDateFrom,
    DateTime? DueDateTo,
    int? ProjectId,
    int? AssignedUserId);
