using Microsoft.AspNetCore.SignalR;

namespace api.Services
{
    public class ChatHub : Hub
    {
        public async Task EnviarMensagem(string usuario, string mensagem)
        {
            await Clients.All.SendAsync("ReceiveMessage", usuario, mensagem);
        }
    }
}
