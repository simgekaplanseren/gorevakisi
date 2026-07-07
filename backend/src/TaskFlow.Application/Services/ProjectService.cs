using TaskFlow.Application.DTOs.Projects;
using TaskFlow.Application.Exceptions;
using TaskFlow.Application.Interfaces.Repositories;
using TaskFlow.Application.Interfaces.Services;
using TaskFlow.Application.Mappings;
using TaskFlow.Domain.Entities;
using TaskFlow.Domain.Enums;

namespace TaskFlow.Application.Services;

public class ProjectService(IUnitOfWork unitOfWork) : IProjectService
{
    public async Task<IEnumerable<ProjectDto>> GetAllAsync(int userId, string role, string? search = null)
    {
        var projects = await unitOfWork.Projects.GetAllWithDetailsAsync(search);

        if (role != UserRole.Admin.ToString())
            projects = projects.Where(p =>
                p.OwnerId == userId ||
                p.Members.Any(m => m.UserId == userId));

        return projects.Select(p => p.ToDto());
    }

    public async Task<ProjectDetailDto> GetByIdAsync(int id, int userId, string role)
    {
        var project = await unitOfWork.Projects.GetByIdWithDetailsAsync(id)
            ?? throw new NotFoundException("Proje bulunamadı.");

        EnsureProjectAccess(project, userId, role);
        return project.ToDetailDto();
    }

    public async Task<ProjectDto> CreateAsync(CreateProjectRequest request, int ownerId)
    {
        var project = new Project
        {
            Name = request.Name,
            Description = request.Description,
            OwnerId = ownerId,
            UpdatedDate = DateTime.UtcNow
        };

        await unitOfWork.Projects.AddAsync(project);
        await unitOfWork.SaveChangesAsync();

        var created = await unitOfWork.Projects.GetByIdWithDetailsAsync(project.Id);
        return created!.ToDto();
    }

    public async Task<ProjectDto> UpdateAsync(int id, UpdateProjectRequest request, int userId, string role)
    {
        var project = await unitOfWork.Projects.GetByIdWithDetailsAsync(id)
            ?? throw new NotFoundException("Proje bulunamadı.");

        EnsureProjectAccess(project, userId, role);

        project.Name = request.Name;
        project.Description = request.Description;
        project.Status = EntityMapper.ParseProjectStatus(request.Status);
        project.UpdatedDate = DateTime.UtcNow;

        unitOfWork.Projects.Update(project);
        await unitOfWork.SaveChangesAsync();

        return project.ToDto();
    }

    public async Task DeleteAsync(int id)
    {
        var project = await unitOfWork.Projects.GetByIdAsync(id)
            ?? throw new NotFoundException("Proje bulunamadı.");

        unitOfWork.Projects.Remove(project);
        await unitOfWork.SaveChangesAsync();
    }

    public async Task AddMemberAsync(int projectId, AddProjectMemberRequest request)
    {
        var project = await unitOfWork.Projects.GetByIdAsync(projectId)
            ?? throw new NotFoundException("Proje bulunamadı.");

        var user = await unitOfWork.Users.GetByIdAsync(request.UserId)
            ?? throw new NotFoundException("Kullanıcı bulunamadı.");

        if (await unitOfWork.Projects.IsMemberAsync(projectId, request.UserId))
            throw new BadRequestException("Kullanıcı zaten proje üyesi.");

        await unitOfWork.Projects.AddMemberAsync(new ProjectMember
        {
            ProjectId = projectId,
            UserId = request.UserId
        });

        project.UpdatedDate = DateTime.UtcNow;
        unitOfWork.Projects.Update(project);
        await unitOfWork.SaveChangesAsync();
    }

    public async Task RemoveMemberAsync(int projectId, int userId)
    {
        if (!await unitOfWork.Projects.IsMemberAsync(projectId, userId))
            throw new NotFoundException("Proje üyesi bulunamadı.");

        await unitOfWork.Projects.RemoveMemberAsync(projectId, userId);
        await unitOfWork.SaveChangesAsync();
    }

    private static void EnsureProjectAccess(Project project, int userId, string role)
    {
        if (role == UserRole.Admin.ToString()) return;

        var hasAccess = project.OwnerId == userId ||
                        project.Members.Any(m => m.UserId == userId);

        if (!hasAccess)
            throw new ForbiddenException("Bu projeye erişim yetkiniz yok.");
    }
}
