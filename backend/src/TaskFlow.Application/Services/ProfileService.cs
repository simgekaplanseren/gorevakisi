using TaskFlow.Application.DTOs.Profile;
using TaskFlow.Application.Exceptions;
using TaskFlow.Application.Interfaces.Repositories;
using TaskFlow.Application.Interfaces.Services;
using TaskFlow.Application.Mappings;
using TaskFlow.Domain.Enums;

namespace TaskFlow.Application.Services;

public class ProfileService(IUnitOfWork unitOfWork) : IProfileService
{
    public async Task<ProfileDto> GetProfileAsync(int userId)
    {
        var user = await unitOfWork.Users.GetByIdAsync(userId)
            ?? throw new NotFoundException("Kullanıcı bulunamadı.");

        var tasks = await unitOfWork.Tasks.GetFilteredAsync(
            null, null, null, null, null, null, userId);

        var taskList = tasks.ToList();

        return user.ToProfileDto(
            taskList.Count,
            taskList.Count(t => t.Status == TaskItemStatus.Completed));
    }

    public async Task<ProfileDto> UpdateProfileAsync(int userId, UpdateProfileRequest request)
    {
        var user = await unitOfWork.Users.GetByIdAsync(userId)
            ?? throw new NotFoundException("Kullanıcı bulunamadı.");

        user.Name = request.Name;
        user.Surname = request.Surname;

        unitOfWork.Users.Update(user);
        await unitOfWork.SaveChangesAsync();

        return await GetProfileAsync(userId);
    }

    public async Task ChangePasswordAsync(int userId, ChangePasswordRequest request)
    {
        var user = await unitOfWork.Users.GetByIdAsync(userId)
            ?? throw new NotFoundException("Kullanıcı bulunamadı.");

        if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
            throw new BadRequestException("Mevcut şifre hatalı.");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        unitOfWork.Users.Update(user);
        await unitOfWork.SaveChangesAsync();
    }

    public async Task<string> UpdateAvatarAsync(int userId, string avatarUrl)
    {
        var user = await unitOfWork.Users.GetByIdAsync(userId)
            ?? throw new NotFoundException("Kullanıcı bulunamadı.");

        user.AvatarUrl = avatarUrl;
        unitOfWork.Users.Update(user);
        await unitOfWork.SaveChangesAsync();

        return avatarUrl;
    }
}
