using System.Net;
using System.Text.Json;
using TaskFlow.Application.Common;
using TaskFlow.Application.Exceptions;

namespace TaskFlow.API.Middleware;

public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Beklenmeyen hata: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, message) = exception switch
        {
            NotFoundException e => (HttpStatusCode.NotFound, e.Message),
            UnauthorizedException e => (HttpStatusCode.Unauthorized, e.Message),
            ForbiddenException e => (HttpStatusCode.Forbidden, e.Message),
            BadRequestException e => (HttpStatusCode.BadRequest, e.Message),
            ArgumentException e => (HttpStatusCode.BadRequest, e.Message),
            _ => (HttpStatusCode.InternalServerError, "Sunucu hatası oluştu.")
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var response = ApiResponse<object>.Fail(message);
        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
