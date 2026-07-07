using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskFlow.Application.Common;
using TaskFlow.Application.DTOs.Tasks;
using TaskFlow.Application.Interfaces.Services;
using TaskFlow.API.Extensions;

namespace TaskFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController(ITaskService taskService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<TaskDto>>>> GetAll([FromQuery] TaskFilterRequest filter)
    {
        var tasks = await taskService.GetAllAsync(filter, User.GetUserId(), User.GetUserRole());
        return Ok(ApiResponse<IEnumerable<TaskDto>>.Ok(tasks));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<TaskDto>>> GetById(int id)
    {
        var task = await taskService.GetByIdAsync(id, User.GetUserId(), User.GetUserRole());
        return Ok(ApiResponse<TaskDto>.Ok(task));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<TaskDto>>> Create([FromBody] CreateTaskRequest request)
    {
        var task = await taskService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = task.Id },
            ApiResponse<TaskDto>.Ok(task, "Görev oluşturuldu."));
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<TaskDto>>> Update(int id, [FromBody] UpdateTaskRequest request)
    {
        var task = await taskService.UpdateAsync(id, request, User.GetUserId(), User.GetUserRole());
        return Ok(ApiResponse<TaskDto>.Ok(task, "Görev güncellendi."));
    }

    [HttpPatch("{id:int}/status")]
    public async Task<ActionResult<ApiResponse<TaskDto>>> UpdateStatus(int id, [FromBody] UpdateTaskStatusRequest request)
    {
        var task = await taskService.UpdateStatusAsync(id, request, User.GetUserId(), User.GetUserRole());
        return Ok(ApiResponse<TaskDto>.Ok(task, "Görev durumu güncellendi."));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
    {
        await taskService.DeleteAsync(id);
        return Ok(ApiResponse<object>.Ok(new { }, "Görev silindi."));
    }
}
