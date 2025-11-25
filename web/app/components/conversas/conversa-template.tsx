"use client";

import { useEffect, useRef, useState } from "react";
import { IConversa } from "../../types/conversas";
import CAvatar from "../ui/c-avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SendHorizonalIcon } from "lucide-react";
import { IMensagem } from "../../types/mensagens";
import { enviarMensagem } from "../../_actions/mensagens";
import { toast } from "sonner";
import { useAuth } from "../../contexts/auth-provider";
import MensagemTemplate from "../mensagens/mensagem-template";
import { conexaoSignalR } from "../../_actions/signalr";
import ConversaEditar from "./conversa-editar";
import { getConversaById } from "../../_actions/conversas";
import { useConversa } from "@/app/contexts/conversas-provider";
import { SignalRMensagem } from "@/app/types/signalR";
import { formatarUrlAnexo } from "@/app/utils";

interface ConversaTemplateProps {
  conversaInicial: IConversa;
}

const ConversaTemplate = ({ conversaInicial }: ConversaTemplateProps) => {
  const [mensagem, setMensagem] = useState<string>("");
  const [conversa, setConversa] = useState<IConversa>(conversaInicial);
  const [openEditar, setOpenEditar] = useState<boolean>(false);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [mensagens, setMensagens] = useState<IMensagem[]>(
    conversa.mensagens ?? []
  );
  const { auth } = useAuth();
  const { adicionarMensagem } = useConversa();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    const conexao = new conexaoSignalR();
    conexao.con();
    conexao.on((dados: SignalRMensagem) => {
      setMensagens((prev) => [
        ...prev,
        {
          mensagemId: dados.mensagemId,
          mensagem: dados.mensagem,
          regidh: dados.regidh,
          visualizada: dados.visualizada,
          usuarioId: dados.usuarioId,
          usuarioNome: dados.nome,
        },
      ]);
    });

    return () => {
      conexao.stop();
    };
  }, [conversa.conversaId]);

  const recarregarConversa = async () => {
    setCarregando(true);
    try {
      const novaConversa = await getConversaById(conversa.conversaId!);
      setConversa(novaConversa.resultado);
    } finally {
      setCarregando(false);
    }
  };

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
        } else {
          adicionarMensagem(data.resultado);
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
        onClick={() => setOpenEditar(!openEditar)}
        className="cursor-pointer flex items-center p-4 rounded-tl-lg rounded-tr-lg gap-2 bg-primary
       w-full"
      >
        <CAvatar
          src={formatarUrlAnexo(
            "conversa",
            "perfil",
            conversa.conversaId!,
            conversa.conversaUsuarios![0].conversaFoto ?? null
          )}
          alt={conversa.conversaUsuarios![0].conversaNome!}
        />
        <span className="text-base text-white font-medium">
          {conversa.conversaUsuarios![0].conversaNome!}
        </span>
      </div>
      <div className="flex h-[700px] p-4 w-full mt-5 flex-col gap-5 overflow-y-scroll">
        {mensagens && mensagens.length > 0 ? (
          mensagens.map((msg, index) => {
            return (
              <MensagemTemplate
                key={index}
                mensagem={msg}
                grupo={conversa.grupo}
              />
            );
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
      <ConversaEditar
        open={openEditar}
        conversa={conversa}
        setOpen={() => setOpenEditar(!openEditar)}
        load={async () => await recarregarConversa()}
      />
    </div>
  );
};

export default ConversaTemplate;
