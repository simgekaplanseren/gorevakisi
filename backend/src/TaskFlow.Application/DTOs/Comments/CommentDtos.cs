namespace TaskFlow.Application.DTOs.Comments;

public record CreateCommentRequest(string Comment);

public record CommentDto(
    int Id,
    string Comment,
    DateTime CreatedDate,
    int TaskId,
    int UserId,
    string UserName);
