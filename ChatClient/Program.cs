using Microsoft.AspNetCore.SignalR.Client;

var connection = new HubConnectionBuilder()
    .WithUrl("https://localhost:7043/chatHub") // substitua pela URL do seu Hub
    .WithAutomaticReconnect()
    .Build();

connection.On<string, string>("ReceiveMessage", (usuario, mensagem) =>
{
    Console.WriteLine($"{usuario}: {mensagem}");
});

await connection.StartAsync();
Console.WriteLine("Conectado ao Hub. Pressione Enter para sair.");
Console.ReadLine();
