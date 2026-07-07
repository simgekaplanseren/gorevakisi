namespace TaskFlow.Application.DTOs.Auth;

public record RegisterRequest(string Name, string Surname, string Email, string Password);
public record LoginRequest(string Email, string Password);
public record ForgotPasswordRequest(string Email);
public record AuthResponse(string Token, UserDto User);

public record UserDto(
    int Id,
    string Name,
    string Surname,
    string Email,
    string Role,
    string? AvatarUrl,
    DateTime CreatedDate);
