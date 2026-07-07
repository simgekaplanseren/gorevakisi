using TaskFlow.Application.DTOs.Auth;
using TaskFlow.Application.DTOs.Comments;
using TaskFlow.Application.DTOs.Dashboard;
using TaskFlow.Application.DTOs.Profile;
using TaskFlow.Application.DTOs.Projects;
using TaskFlow.Application.DTOs.Tasks;
using TaskFlow.Application.DTOs.Users;
using TaskFlow.Domain.Entities;

namespace TaskFlow.Application.Interfaces.Services;

public interface ITokenService
{
    string GenerateToken(User user);
}

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<UserDto> GetCurrentUserAsync(int userId);
    Task ForgotPasswordAsync(ForgotPasswordRequest request);
}

public interface IUserService
{
    Task<IEnumerable<UserDto>> GetAllAsync();
    Task<UserDto> CreateAsync(CreateUserRequest request);
    Task<UserDto> UpdateAsync(int id, UpdateUserRequest request);
    Task DeleteAsync(int id);
}

public interface IProjectService
{
    Task<IEnumerable<ProjectDto>> GetAllAsync(int userId, string role, string? search = null);
    Task<ProjectDetailDto> GetByIdAsync(int id, int userId, string role);
    Task<ProjectDto> CreateAsync(CreateProjectRequest request, int ownerId);
    Task<ProjectDto> UpdateAsync(int id, UpdateProjectRequest request, int userId, string role);
    Task DeleteAsync(int id);
    Task AddMemberAsync(int projectId, AddProjectMemberRequest request);
    Task RemoveMemberAsync(int projectId, int userId);
}

public interface ITaskService
{
    Task<IEnumerable<TaskDto>> GetAllAsync(TaskFilterRequest filter, int userId, string role);
    Task<TaskDto> GetByIdAsync(int id, int userId, string role);
    Task<TaskDto> CreateAsync(CreateTaskRequest request);
    Task<TaskDto> UpdateAsync(int id, UpdateTaskRequest request, int userId, string role);
    Task<TaskDto> UpdateStatusAsync(int id, UpdateTaskStatusRequest request, int userId, string role);
    Task DeleteAsync(int id);
}

public interface ICommentService
{
    Task<IEnumerable<CommentDto>> GetByTaskIdAsync(int taskId, int userId, string role);
    Task<CommentDto> CreateAsync(int taskId, CreateCommentRequest request, int userId);
}

public interface IDashboardService
{
    Task<DashboardStatsDto> GetStatsAsync(int userId, string role);
    Task<IEnumerable<NotificationDto>> GetNotificationsAsync(int userId, string role);
}

public interface IProfileService
{
    Task<ProfileDto> GetProfileAsync(int userId);
    Task<ProfileDto> UpdateProfileAsync(int userId, UpdateProfileRequest request);
    Task ChangePasswordAsync(int userId, ChangePasswordRequest request);
    Task<string> UpdateAvatarAsync(int userId, string avatarUrl);
}
