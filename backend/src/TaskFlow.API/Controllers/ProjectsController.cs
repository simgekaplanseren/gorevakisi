using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskFlow.Application.Common;
using TaskFlow.Application.DTOs.Projects;
using TaskFlow.Application.Interfaces.Services;
using TaskFlow.API.Extensions;

namespace TaskFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProjectsController(IProjectService projectService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProjectDto>>>> GetAll([FromQuery] string? search)
    {
        var projects = await projectService.GetAllAsync(
            User.GetUserId(), User.GetUserRole(), search);
        return Ok(ApiResponse<IEnumerable<ProjectDto>>.Ok(projects));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<ProjectDetailDto>>> GetById(int id)
    {
        var project = await projectService.GetByIdAsync(id, User.GetUserId(), User.GetUserRole());
        return Ok(ApiResponse<ProjectDetailDto>.Ok(project));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<ProjectDto>>> Create([FromBody] CreateProjectRequest request)
    {
        var project = await projectService.CreateAsync(request, User.GetUserId());
        return CreatedAtAction(nameof(GetById), new { id = project.Id },
            ApiResponse<ProjectDto>.Ok(project, "Proje oluşturuldu."));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ApiResponse<ProjectDto>>> Update(int id, [FromBody] UpdateProjectRequest request)
    {
        var project = await projectService.UpdateAsync(id, request, User.GetUserId(), User.GetUserRole());
        return Ok(ApiResponse<ProjectDto>.Ok(project, "Proje güncellendi."));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
    {
        await projectService.DeleteAsync(id);
        return Ok(ApiResponse<object>.Ok(new { }, "Proje silindi."));
    }

    [HttpPost("{id:int}/members")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<object>>> AddMember(int id, [FromBody] AddProjectMemberRequest request)
    {
        await projectService.AddMemberAsync(id, request);
        return Ok(ApiResponse<object>.Ok(new { }, "Ekip üyesi eklendi."));
    }

    [HttpDelete("{id:int}/members/{userId:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<object>>> RemoveMember(int id, int userId)
    {
        await projectService.RemoveMemberAsync(id, userId);
        return Ok(ApiResponse<object>.Ok(new { }, "Ekip üyesi çıkarıldı."));
    }
}
