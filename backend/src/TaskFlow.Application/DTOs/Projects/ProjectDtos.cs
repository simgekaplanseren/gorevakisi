namespace TaskFlow.Application.DTOs.Projects;

public record CreateProjectRequest(string Name, string Description);
public record UpdateProjectRequest(string Name, string Description, string Status);
public record AddProjectMemberRequest(int UserId);

public record ProjectDto(
    int Id,
    string Name,
    string Description,
    string Status,
    DateTime CreatedDate,
    DateTime UpdatedDate,
    int OwnerId,
    string OwnerName,
    int TotalTasks,
    int CompletedTasks,
    double ProgressPercentage);

public record ProjectDetailDto(
    int Id,
    string Name,
    string Description,
    string Status,
    DateTime CreatedDate,
    DateTime UpdatedDate,
    int OwnerId,
    string OwnerName,
    IEnumerable<ProjectMemberDto> Members,
    int TotalTasks,
    int CompletedTasks,
    double ProgressPercentage);

public record ProjectMemberDto(int UserId, string Name, string Surname, string Email, DateTime JoinedDate);
