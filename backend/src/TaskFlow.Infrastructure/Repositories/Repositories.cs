using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.Interfaces.Repositories;
using TaskFlow.Domain.Entities;
using TaskFlow.Infrastructure.Data;

namespace TaskFlow.Infrastructure.Repositories;

public class UserRepository(ApplicationDbContext context)
    : GenericRepository<User>(context), IUserRepository
{
    public async Task<User?> GetByEmailAsync(string email) =>
        await Context.Users.FirstOrDefaultAsync(u => u.Email == email);

    public async Task<bool> EmailExistsAsync(string email) =>
        await Context.Users.AnyAsync(u => u.Email == email);
}

public class ProjectRepository(ApplicationDbContext context)
    : GenericRepository<Project>(context), IProjectRepository
{
    public async Task<IEnumerable<Project>> GetAllWithDetailsAsync(string? search = null)
    {
        var query = Context.Projects
            .Include(p => p.Owner)
            .Include(p => p.Tasks)
            .Include(p => p.Members)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(p =>
                p.Name.Contains(search) || p.Description.Contains(search));

        return await query.OrderByDescending(p => p.UpdatedDate).ToListAsync();
    }

    public async Task<Project?> GetByIdWithDetailsAsync(int id) =>
        await Context.Projects
            .Include(p => p.Owner)
            .Include(p => p.Tasks)
            .Include(p => p.Members).ThenInclude(m => m.User)
            .FirstOrDefaultAsync(p => p.Id == id);

    public async Task<bool> IsMemberAsync(int projectId, int userId) =>
        await Context.ProjectMembers.AnyAsync(pm =>
            pm.ProjectId == projectId && pm.UserId == userId);

    public async Task AddMemberAsync(ProjectMember member) =>
        await Context.ProjectMembers.AddAsync(member);

    public async Task RemoveMemberAsync(int projectId, int userId)
    {
        var member = await Context.ProjectMembers
            .FirstOrDefaultAsync(pm => pm.ProjectId == projectId && pm.UserId == userId);

        if (member != null)
            Context.ProjectMembers.Remove(member);
    }
}

public class TaskRepository(ApplicationDbContext context)
    : GenericRepository<TaskItem>(context), ITaskRepository
{
    public async Task<IEnumerable<TaskItem>> GetFilteredAsync(
        string? search,
        Domain.Enums.TaskItemStatus? status,
        Domain.Enums.TaskPriority? priority,
        DateTime? dueDateFrom,
        DateTime? dueDateTo,
        int? projectId,
        int? assignedUserId)
    {
        var query = Context.Tasks
            .Include(t => t.Project)
            .Include(t => t.AssignedUser)
            .Include(t => t.Comments)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(t =>
                t.Title.Contains(search) || t.Description.Contains(search));

        if (status.HasValue)
            query = query.Where(t => t.Status == status.Value);

        if (priority.HasValue)
            query = query.Where(t => t.Priority == priority.Value);

        if (dueDateFrom.HasValue)
            query = query.Where(t => t.DueDate >= dueDateFrom.Value);

        if (dueDateTo.HasValue)
            query = query.Where(t => t.DueDate <= dueDateTo.Value);

        if (projectId.HasValue)
            query = query.Where(t => t.ProjectId == projectId.Value);

        if (assignedUserId.HasValue)
            query = query.Where(t => t.AssignedUserId == assignedUserId.Value);

        return await query.OrderByDescending(t => t.UpdatedDate).ToListAsync();
    }

    public async Task<TaskItem?> GetByIdWithDetailsAsync(int id) =>
        await Context.Tasks
            .Include(t => t.Project)
            .Include(t => t.AssignedUser)
            .Include(t => t.Comments)
            .FirstOrDefaultAsync(t => t.Id == id);

    public async Task<IEnumerable<TaskItem>> GetRecentAsync(int count) =>
        await Context.Tasks
            .Include(t => t.Project)
            .Include(t => t.AssignedUser)
            .OrderByDescending(t => t.CreatedDate)
            .Take(count)
            .ToListAsync();

    public async Task<int> CountByStatusAsync(Domain.Enums.TaskItemStatus status) =>
        await Context.Tasks.CountAsync(t => t.Status == status);

    public async Task<int> CountOverdueAsync()
    {
        var today = DateTime.UtcNow.Date;
        return await Context.Tasks.CountAsync(t =>
            t.DueDate.HasValue &&
            t.DueDate.Value.Date < today &&
            t.Status != Domain.Enums.TaskItemStatus.Completed);
    }

    public async Task<int> CountDueTodayAsync()
    {
        var today = DateTime.UtcNow.Date;
        return await Context.Tasks.CountAsync(t =>
            t.DueDate.HasValue &&
            t.DueDate.Value.Date == today &&
            t.Status != Domain.Enums.TaskItemStatus.Completed);
    }
}

public class CommentRepository(ApplicationDbContext context)
    : GenericRepository<TaskComment>(context), ICommentRepository
{
    public async Task<IEnumerable<TaskComment>> GetByTaskIdAsync(int taskId) =>
        await Context.TaskComments
            .Include(c => c.User)
            .Where(c => c.TaskId == taskId)
            .OrderByDescending(c => c.CreatedDate)
            .ToListAsync();
}

public class UnitOfWork(ApplicationDbContext context) : IUnitOfWork
{
    private IUserRepository? _users;
    private IProjectRepository? _projects;
    private ITaskRepository? _tasks;
    private ICommentRepository? _comments;

    public IUserRepository Users => _users ??= new UserRepository(context);
    public IProjectRepository Projects => _projects ??= new ProjectRepository(context);
    public ITaskRepository Tasks => _tasks ??= new TaskRepository(context);
    public ICommentRepository Comments => _comments ??= new CommentRepository(context);

    public async Task<int> SaveChangesAsync() => await context.SaveChangesAsync();

    public void Dispose() => context.Dispose();
}
