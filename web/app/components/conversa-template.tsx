"use client";

import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { IConversa } from "../types/conversas";
import CAvatar from "./ui/c-avatar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SendHorizonalIcon } from "lucide-react";
import { IMensagem } from "../types/mensagens";
import { enviarMensagem } from "../_actions/mensagens";
import { toast } from "sonner";
import { useAuth } from "../contexts/auth-provider";

interface ConversaTemplateProps {
  conversa: IConversa;
}

const ConversaTemplate = ({ conversa }: ConversaTemplateProps) => {
  const [mensagem, setMensagem] = useState<string>("");
  const [carregando, setCarregando] = useState<boolean>();
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [mensagens, setMensagens] = useState<IMensagem[]>(
    conversa.mensagens ?? []
  );
  const { auth } = useAuth();

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7043/chathub")
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("Conectado ao SignalR");
        setConnection(newConnection);

        const handleReceiveMessage = (
          usuarioNome: string,
          mensagem: string
        ) => {
          setMensagens((prev) => [...prev, { usuarioNome, mensagem }]);
        };

        newConnection.on("ReceiveMessage", handleReceiveMessage);
      })
      .catch((err: any) => console.error(err));

    return () => {
      console.log("Desconectando do SignalR...");
      newConnection.off("ReceiveMessage");
      newConnection.stop();
    };
  }, [conversa.conversaId]);

  const enviar = async () => {
    try {
      setCarregando(true);
      if (mensagem !== "") {
        const msg: IMensagem = {
          conversaId: conversa.conversaId!,
          mensagem: mensagem,
          usuarioId: auth.usuarioId!,
        };
        const data = await enviarMensagem(msg);
        if (data.erro) {
          console.error(data.mensagemApi);
          toast.error(data.mensagem);
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        toast.error(error.message);
      } else {
        console.error("Ocorreu um erro:", error);
      }
    }
    setCarregando(false);
    setMensagem("");
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="flex items-center p-4 rounded-tl-lg rounded-tr-lg gap-2 bg-primary
       w-full"
      >
        <CAvatar
          src={`${process.env.NEXT_PUBLIC_APP_URL}/uploads/conversas/conversa_${
            conversa.conversaId
          }/perfil/${conversa.conversaUsuarios![0].conversaFoto!}`}
          alt={conversa.conversaUsuarios![0].conversaNome!}
        />
        <span className="text-base text-white font-medium">
          {conversa.conversaUsuarios![0].conversaNome!}
        </span>
      </div>
      <div className="flex h-[700px] p-4 w-full mt-5 flex-col gap-5 overflow-y-scroll">
        {mensagens && mensagens.length > 0 ? (
          mensagens.map((msg, index) => {
            return <span key={index}>{msg.mensagem}</span>;
          })
        ) : (
          <div className="p-2 flex justify-center items-center text-xs">
            Sua conversa ainda não teve nenhuma mensagem :(
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex w-full items-center gap-5 px-4">
        <Input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              enviar();
            }
          }}
          placeholder="Digite sua mensagem aqui"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setMensagem(e.target.value)
          }
          value={mensagem ?? ""}
        />
        <Button loading={carregando} onClick={enviar}>
          <SendHorizonalIcon />
        </Button>
      </div>
    </div>
  );
};

export default ConversaTemplate;
