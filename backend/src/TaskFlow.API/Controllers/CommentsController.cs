using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskFlow.Application.Common;
using TaskFlow.Application.DTOs.Comments;
using TaskFlow.Application.Interfaces.Services;
using TaskFlow.API.Extensions;

namespace TaskFlow.API.Controllers;

[ApiController]
[Route("api/tasks/{taskId:int}/comments")]
[Authorize]
public class CommentsController(ICommentService commentService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<CommentDto>>>> GetAll(int taskId)
    {
        var comments = await commentService.GetByTaskIdAsync(taskId, User.GetUserId(), User.GetUserRole());
        return Ok(ApiResponse<IEnumerable<CommentDto>>.Ok(comments));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<CommentDto>>> Create(int taskId, [FromBody] CreateCommentRequest request)
    {
        var comment = await commentService.CreateAsync(taskId, request, User.GetUserId());
        return Ok(ApiResponse<CommentDto>.Ok(comment, "Yorum eklendi."));
    }
}
