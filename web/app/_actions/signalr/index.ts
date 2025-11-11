import * as signalR from "@microsoft/signalr";

export class conexaoSignalR {
  private conexao: signalR.HubConnection;
  constructor() {
    this.conexao = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7043/chathub")
      .withAutomaticReconnect()
      .build();
  }

  async con() {
    if (this.conexao.state === "Connected") return;
    try {
      await this.conexao.start();
      console.log("Conectado ao SignalR");
    } catch (err) {
      console.error("Erro ao conectar ao SignalR:", err);
    }
  }

  on(callBack: (dados: any) => void): void {
    this.conexao.on("ReceiveMessage", callBack)
  }

  off(): void {
    this.conexao.off("ReceiveMessage");
  }

  stop(): void {
    this.conexao.stop();
  }
}