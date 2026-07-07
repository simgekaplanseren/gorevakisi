using TaskFlow.Application.DTOs.Auth;
using TaskFlow.Application.DTOs.Users;
using TaskFlow.Application.Exceptions;
using TaskFlow.Application.Interfaces.Repositories;
using TaskFlow.Application.Interfaces.Services;
using TaskFlow.Application.Mappings;
using TaskFlow.Domain.Entities;
using TaskFlow.Domain.Enums;

namespace TaskFlow.Application.Services;

public class AuthService(IUnitOfWork unitOfWork, ITokenService tokenService) : IAuthService
{
    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        if (await unitOfWork.Users.EmailExistsAsync(request.Email))
            throw new BadRequestException("Bu e-posta adresi zaten kayıtlı.");

        var user = new User
        {
            Name = request.Name,
            Surname = request.Surname,
            Email = request.Email.ToLowerInvariant(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = UserRole.User
        };

        await unitOfWork.Users.AddAsync(user);
        await unitOfWork.SaveChangesAsync();

        return new AuthResponse(tokenService.GenerateToken(user), user.ToDto());
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await unitOfWork.Users.GetByEmailAsync(request.Email.ToLowerInvariant())
            ?? throw new UnauthorizedException("E-posta veya şifre hatalı.");

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedException("E-posta veya şifre hatalı.");

        return new AuthResponse(tokenService.GenerateToken(user), user.ToDto());
    }

    public async Task<UserDto> GetCurrentUserAsync(int userId)
    {
        var user = await unitOfWork.Users.GetByIdAsync(userId)
            ?? throw new NotFoundException("Kullanıcı bulunamadı.");

        return user.ToDto();
    }

    public Task ForgotPasswordAsync(ForgotPasswordRequest request) =>
        Task.CompletedTask;
}

public class UserService(IUnitOfWork unitOfWork) : IUserService
{
    public async Task<IEnumerable<UserDto>> GetAllAsync()
    {
        var users = await unitOfWork.Users.GetAllAsync();
        return users.Select(u => u.ToDto());
    }

    public async Task<UserDto> CreateAsync(CreateUserRequest request)
    {
        if (await unitOfWork.Users.EmailExistsAsync(request.Email))
            throw new BadRequestException("Bu e-posta adresi zaten kayıtlı.");

        var user = new User
        {
            Name = request.Name,
            Surname = request.Surname,
            Email = request.Email.ToLowerInvariant(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = EntityMapper.ParseUserRole(request.Role)
        };

        await unitOfWork.Users.AddAsync(user);
        await unitOfWork.SaveChangesAsync();

        return user.ToDto();
    }

    public async Task<UserDto> UpdateAsync(int id, UpdateUserRequest request)
    {
        var user = await unitOfWork.Users.GetByIdAsync(id)
            ?? throw new NotFoundException("Kullanıcı bulunamadı.");

        user.Name = request.Name;
        user.Surname = request.Surname;
        user.Email = request.Email.ToLowerInvariant();
        user.Role = EntityMapper.ParseUserRole(request.Role);

        unitOfWork.Users.Update(user);
        await unitOfWork.SaveChangesAsync();

        return user.ToDto();
    }

    public async Task DeleteAsync(int id)
    {
        var user = await unitOfWork.Users.GetByIdAsync(id)
            ?? throw new NotFoundException("Kullanıcı bulunamadı.");

        unitOfWork.Users.Remove(user);
        await unitOfWork.SaveChangesAsync();
    }
}
