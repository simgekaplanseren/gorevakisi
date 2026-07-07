namespace TaskFlow.Domain.Entities;

public class TaskComment
{
    public int Id { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public int TaskId { get; set; }
    public int UserId { get; set; }

    public TaskItem Task { get; set; } = null!;
    public User User { get; set; } = null!;
}
