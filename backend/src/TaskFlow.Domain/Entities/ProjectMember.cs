namespace TaskFlow.Domain.Entities;

public class ProjectMember
{
    public int ProjectId { get; set; }
    public int UserId { get; set; }
    public DateTime JoinedDate { get; set; } = DateTime.UtcNow;

    public Project Project { get; set; } = null!;
    public User User { get; set; } = null!;
}
