namespace TaskFlow.Application.DTOs.Users;

public record CreateUserRequest(string Name, string Surname, string Email, string Password, string Role);
public record UpdateUserRequest(string Name, string Surname, string Email, string Role);
