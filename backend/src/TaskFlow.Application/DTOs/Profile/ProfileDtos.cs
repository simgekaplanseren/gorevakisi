namespace TaskFlow.Application.DTOs.Profile;

public record UpdateProfileRequest(string Name, string Surname);
public record ChangePasswordRequest(string CurrentPassword, string NewPassword);

public record ProfileDto(
    int Id,
    string Name,
    string Surname,
    string Email,
    string Role,
    string? AvatarUrl,
    DateTime CreatedDate,
    int AssignedTaskCount,
    int CompletedTaskCount);
