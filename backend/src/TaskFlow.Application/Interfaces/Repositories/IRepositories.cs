using System.Linq.Expressions;
using TaskFlow.Domain.Entities;

namespace TaskFlow.Application.Interfaces.Repositories;

public interface IGenericRepository<T> where T : class
{
    Task<T?> GetByIdAsync(int id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
    Task<T> AddAsync(T entity);
    void Update(T entity);
    void Remove(T entity);
}

public interface IUserRepository : IGenericRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<bool> EmailExistsAsync(string email);
}

public interface IProjectRepository : IGenericRepository<Project>
{
    Task<IEnumerable<Project>> GetAllWithDetailsAsync(string? search = null);
    Task<Project?> GetByIdWithDetailsAsync(int id);
    Task<bool> IsMemberAsync(int projectId, int userId);
    Task AddMemberAsync(ProjectMember member);
    Task RemoveMemberAsync(int projectId, int userId);
}

public interface ITaskRepository : IGenericRepository<TaskItem>
{
    Task<IEnumerable<TaskItem>> GetFilteredAsync(
        string? search,
        Domain.Enums.TaskItemStatus? status,
        Domain.Enums.TaskPriority? priority,
        DateTime? dueDateFrom,
        DateTime? dueDateTo,
        int? projectId,
        int? assignedUserId);

    Task<TaskItem?> GetByIdWithDetailsAsync(int id);
    Task<IEnumerable<TaskItem>> GetRecentAsync(int count);
    Task<int> CountByStatusAsync(Domain.Enums.TaskItemStatus status);
    Task<int> CountOverdueAsync();
    Task<int> CountDueTodayAsync();
}

public interface ICommentRepository : IGenericRepository<TaskComment>
{
    Task<IEnumerable<TaskComment>> GetByTaskIdAsync(int taskId);
}

public interface IUnitOfWork : IDisposable
{
    IUserRepository Users { get; }
    IProjectRepository Projects { get; }
    ITaskRepository Tasks { get; }
    ICommentRepository Comments { get; }
    Task<int> SaveChangesAsync();
}
