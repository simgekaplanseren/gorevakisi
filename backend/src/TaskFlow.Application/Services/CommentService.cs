using TaskFlow.Application.DTOs.Comments;
using TaskFlow.Application.Exceptions;
using TaskFlow.Application.Interfaces.Repositories;
using TaskFlow.Application.Interfaces.Services;
using TaskFlow.Application.Mappings;
using TaskFlow.Domain.Entities;
using TaskFlow.Domain.Enums;

namespace TaskFlow.Application.Services;

public class CommentService(IUnitOfWork unitOfWork) : ICommentService
{
    public async Task<IEnumerable<CommentDto>> GetByTaskIdAsync(int taskId, int userId, string role)
    {
        var task = await unitOfWork.Tasks.GetByIdWithDetailsAsync(taskId)
            ?? throw new NotFoundException("Görev bulunamadı.");

        if (role != UserRole.Admin.ToString() && task.AssignedUserId != userId)
            throw new ForbiddenException("Bu görevin yorumlarına erişim yetkiniz yok.");

        var comments = await unitOfWork.Comments.GetByTaskIdAsync(taskId);
        return comments.Select(c => c.ToDto());
    }

    public async Task<CommentDto> CreateAsync(int taskId, CreateCommentRequest request, int userId)
    {
        var task = await unitOfWork.Tasks.GetByIdWithDetailsAsync(taskId)
            ?? throw new NotFoundException("Görev bulunamadı.");

        if (task.AssignedUserId != userId)
        {
            var user = await unitOfWork.Users.GetByIdAsync(userId);
            if (user?.Role != UserRole.Admin)
                throw new ForbiddenException("Bu göreve yorum yazma yetkiniz yok.");
        }

        var comment = new TaskComment
        {
            Comment = request.Comment,
            TaskId = taskId,
            UserId = userId
        };

        await unitOfWork.Comments.AddAsync(comment);
        await unitOfWork.SaveChangesAsync();

        var created = (await unitOfWork.Comments.GetByTaskIdAsync(taskId))
            .First(c => c.Id == comment.Id);

        return created.ToDto();
    }
}
