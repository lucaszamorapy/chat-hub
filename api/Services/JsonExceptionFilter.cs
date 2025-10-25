using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace PGMTApi.Services
{
    public class JsonExceptionFilter : IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
            var result = new ObjectResult(new
            {
                code = 500,
                message = context.Exception.Message + (context.Exception.InnerException != null ? context.Exception.InnerException.Message : ""),
                stacktrace = context.Exception.StackTrace
            });

            result.StatusCode = 500;
            context.Result = result;
        }
    }
}
