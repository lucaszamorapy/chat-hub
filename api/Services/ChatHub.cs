using Microsoft.AspNetCore.SignalR;

namespace api.Services
{
    public class ChatHub : Hub
    {
        public async Task EnviarMensagem(string usuario, string mensagem)
        //uso do cliente para enviar a mensagem para todos os clientes conectados
        {
            await Clients.All.SendAsync("ReceiveMessage", usuario, mensagem);
        }
    }
}
