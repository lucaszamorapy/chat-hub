using api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace PGMTApi.Services
{
    public class JsonExceptionFilter : IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
            var mensagemApi = context.Exception.Message + (context.Exception.InnerException != null ? context.Exception.InnerException.Message : "");
            var resultado = new Message<object>(mensagemApi, null, true, mensagemApi);
            context.Result = new ObjectResult(resultado)
            {
                StatusCode = 500
            };
        }
    }
}
