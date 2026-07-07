using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskFlow.Application.Common;
using TaskFlow.Application.DTOs.Profile;
using TaskFlow.Application.Interfaces.Services;
using TaskFlow.API.Extensions;

namespace TaskFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController(IProfileService profileService, IWebHostEnvironment environment) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<ProfileDto>>> GetProfile()
    {
        var profile = await profileService.GetProfileAsync(User.GetUserId());
        return Ok(ApiResponse<ProfileDto>.Ok(profile));
    }

    [HttpPut]
    public async Task<ActionResult<ApiResponse<ProfileDto>>> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var profile = await profileService.UpdateProfileAsync(User.GetUserId(), request);
        return Ok(ApiResponse<ProfileDto>.Ok(profile, "Profil güncellendi."));
    }

    [HttpPut("password")]
    public async Task<ActionResult<ApiResponse<object>>> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        await profileService.ChangePasswordAsync(User.GetUserId(), request);
        return Ok(ApiResponse<object>.Ok(new { }, "Şifre değiştirildi."));
    }

    [HttpPost("avatar")]
    public async Task<ActionResult<ApiResponse<object>>> UploadAvatar(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(ApiResponse<object>.Fail("Dosya seçilmedi."));

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        var allowed = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };

        if (!allowed.Contains(extension))
            return BadRequest(ApiResponse<object>.Fail("Desteklenmeyen dosya formatı."));

        var avatarFileName = $"{User.GetUserId()}_{Guid.NewGuid()}{extension}";
        var avatarUrl = $"/uploads/{avatarFileName}";

        var uploadsPath = Path.Combine(environment.WebRootPath, "uploads");
        Directory.CreateDirectory(uploadsPath);

        var filePath = Path.Combine(uploadsPath, avatarFileName);
        await using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        await profileService.UpdateAvatarAsync(User.GetUserId(), avatarUrl);

        return Ok(ApiResponse<object>.Ok(new { avatarUrl }, "Profil fotoğrafı güncellendi."));
    }
}
