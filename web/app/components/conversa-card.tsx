import { useState } from "react";
import { IConversa } from "../types/conversas";
import { formatarData } from "../utils";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { IMensagem } from "../types/mensagens";
import { toast } from "sonner";
import { visualizarMensagens } from "../_actions/conversas";

interface ConversaCardProps {
  conversa: IConversa;
  mensagensVisualizadas: IMensagem[];
}

const ConversaCard = ({
  conversa,
  mensagensVisualizadas,
}: ConversaCardProps) => {
  const [msgVisualizasQtd, setMsgVisualizadasQtd] = useState<number>(
    mensagensVisualizadas.length
  );

  const visualizarTodasMensagens = async () => {
    try {
      const data = await visualizarMensagens(mensagensVisualizadas);
      if (data.erro) {
        console.error(data.mensagem);
        toast.error(data.mensagem);
      }
      setMsgVisualizadasQtd(0);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div key={conversa.conversaId} onClick={() => visualizarTodasMensagens()}>
        <Link
          href={`/conversa/${conversa.conversaId}`}
          className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col gap-2  border-b p-4 text-sm leading-tight"
        >
          <div className="flex items-center w-full">
            <Avatar className="h-8 mr-3 w-8 rounded-lg">
              <AvatarImage
                src={conversa.conversaFoto ? conversa.conversaFoto : ""}
                alt={conversa.conversaNome}
              />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>

            <div className="flex items-center justify-between w-full">
              <span className="font-medium truncate">
                {conversa.conversaNome}
              </span>
              {msgVisualizasQtd > 0 && (
                <Badge
                  variant="default"
                  className="h-5 min-w-5 rounded-full px-1 text-xs shrink-0 whitespace-nowrap"
                >
                  {msgVisualizasQtd}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center w-full">
            {conversa.mensagens && conversa.mensagens.length > 0 && (
              <span className="w-45 text-xs mr-2 truncate">
                {conversa.mensagens[0].mensagem}
              </span>
            )}

            {conversa.mensagens && conversa.mensagens.length > 0 && (
              <span
                style={{ fontSize: "10px" }}
                className="shrink-0 whitespace-nowrap"
              >
                {formatarData(conversa.mensagens[0].regidh, "dataehoratexto")}
              </span>
            )}
          </div>
        </Link>
      </div>
    </>
  );
};

export default ConversaCard;
