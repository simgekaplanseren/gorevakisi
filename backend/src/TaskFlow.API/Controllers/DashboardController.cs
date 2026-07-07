using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskFlow.Application.Common;
using TaskFlow.Application.DTOs.Dashboard;
using TaskFlow.Application.Interfaces.Services;
using TaskFlow.API.Extensions;

namespace TaskFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController(IDashboardService dashboardService) : ControllerBase
{
    [HttpGet("stats")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<DashboardStatsDto>>> GetStats()
    {
        var stats = await dashboardService.GetStatsAsync(User.GetUserId(), User.GetUserRole());
        return Ok(ApiResponse<DashboardStatsDto>.Ok(stats));
    }

    [HttpGet("notifications")]
    public async Task<ActionResult<ApiResponse<IEnumerable<NotificationDto>>>> GetNotifications()
    {
        var notifications = await dashboardService.GetNotificationsAsync(User.GetUserId(), User.GetUserRole());
        return Ok(ApiResponse<IEnumerable<NotificationDto>>.Ok(notifications));
    }
}
