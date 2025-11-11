using Microsoft.AspNetCore.SignalR;

namespace api.Services
{
    public class ChatHub : Hub
    {
        public async Task EnviarMensagem(int mensagemId, DateTime visualizada, int usuarioId, string nome, string mensagem, DateTime regidh)
        {
            await Clients.All.SendAsync("ReceiveMessage", new
            {
                mensagemId,
                visualizada,
                mensagem,
                usuarioId,
                nome,
                regidh
            });
        }
    }
}
