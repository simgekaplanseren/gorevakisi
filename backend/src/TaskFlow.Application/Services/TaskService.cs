using TaskFlow.Application.DTOs.Tasks;
using TaskFlow.Application.Exceptions;
using TaskFlow.Application.Interfaces.Repositories;
using TaskFlow.Application.Interfaces.Services;
using TaskFlow.Application.Mappings;
using TaskFlow.Domain.Entities;
using TaskFlow.Domain.Enums;

namespace TaskFlow.Application.Services;

public class TaskService(IUnitOfWork unitOfWork) : ITaskService
{
    public async Task<IEnumerable<TaskDto>> GetAllAsync(TaskFilterRequest filter, int userId, string role)
    {
        TaskItemStatus? status = null;
        TaskPriority? priority = null;

        if (!string.IsNullOrWhiteSpace(filter.Status))
            status = EntityMapper.ParseTaskStatus(filter.Status);

        if (!string.IsNullOrWhiteSpace(filter.Priority))
            priority = EntityMapper.ParseTaskPriority(filter.Priority);

        var assignedUserId = role == UserRole.Admin.ToString()
            ? filter.AssignedUserId
            : userId;

        if (role != UserRole.Admin.ToString())
            filter = filter with { AssignedUserId = userId };

        var tasks = await unitOfWork.Tasks.GetFilteredAsync(
            filter.Search,
            status,
            priority,
            filter.DueDateFrom,
            filter.DueDateTo,
            filter.ProjectId,
            assignedUserId);

        return tasks.Select(t => t.ToDto());
    }

    public async Task<TaskDto> GetByIdAsync(int id, int userId, string role)
    {
        var task = await unitOfWork.Tasks.GetByIdWithDetailsAsync(id)
            ?? throw new NotFoundException("Görev bulunamadı.");

        EnsureTaskAccess(task, userId, role);
        return task.ToDto();
    }

    public async Task<TaskDto> CreateAsync(CreateTaskRequest request)
    {
        var project = await unitOfWork.Projects.GetByIdAsync(request.ProjectId)
            ?? throw new NotFoundException("Proje bulunamadı.");

        var task = new TaskItem
        {
            Title = request.Title,
            Description = request.Description,
            Priority = EntityMapper.ParseTaskPriority(request.Priority),
            DueDate = request.DueDate,
            ProjectId = request.ProjectId,
            AssignedUserId = request.AssignedUserId,
            UpdatedDate = DateTime.UtcNow
        };

        await unitOfWork.Tasks.AddAsync(task);

        project.UpdatedDate = DateTime.UtcNow;
        unitOfWork.Projects.Update(project);

        await unitOfWork.SaveChangesAsync();

        var created = await unitOfWork.Tasks.GetByIdWithDetailsAsync(task.Id);
        return created!.ToDto();
    }

    public async Task<TaskDto> UpdateAsync(int id, UpdateTaskRequest request, int userId, string role)
    {
        var task = await unitOfWork.Tasks.GetByIdWithDetailsAsync(id)
            ?? throw new NotFoundException("Görev bulunamadı.");

        if (role != UserRole.Admin.ToString())
            throw new ForbiddenException("Görev düzenleme yetkiniz yok.");

        task.Title = request.Title;
        task.Description = request.Description;
        task.Priority = EntityMapper.ParseTaskPriority(request.Priority);
        task.Status = EntityMapper.ParseTaskStatus(request.Status);
        task.DueDate = request.DueDate;
        task.AssignedUserId = request.AssignedUserId;
        task.UpdatedDate = DateTime.UtcNow;

        unitOfWork.Tasks.Update(task);
        await unitOfWork.SaveChangesAsync();

        return task.ToDto();
    }

    public async Task<TaskDto> UpdateStatusAsync(int id, UpdateTaskStatusRequest request, int userId, string role)
    {
        var task = await unitOfWork.Tasks.GetByIdWithDetailsAsync(id)
            ?? throw new NotFoundException("Görev bulunamadı.");

        EnsureTaskAccess(task, userId, role);

        task.Status = EntityMapper.ParseTaskStatus(request.Status);
        task.UpdatedDate = DateTime.UtcNow;

        unitOfWork.Tasks.Update(task);
        await unitOfWork.SaveChangesAsync();

        return task.ToDto();
    }

    public async Task DeleteAsync(int id)
    {
        var task = await unitOfWork.Tasks.GetByIdAsync(id)
            ?? throw new NotFoundException("Görev bulunamadı.");

        unitOfWork.Tasks.Remove(task);
        await unitOfWork.SaveChangesAsync();
    }

    private static void EnsureTaskAccess(TaskItem task, int userId, string role)
    {
        if (role == UserRole.Admin.ToString()) return;

        if (task.AssignedUserId != userId)
            throw new ForbiddenException("Bu göreve erişim yetkiniz yok.");
    }
}
