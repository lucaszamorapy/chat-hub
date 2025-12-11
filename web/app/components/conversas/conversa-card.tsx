import { useEffect, useState } from "react";
import { IConversaUsuario } from "../../types/conversas";
import { formatarData, formatarUrlAnexo } from "../../utils";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { IMensagem } from "../../types/mensagens";
import { toast } from "sonner";
import { visualizarMensagens } from "../../actions/conversas";
import CAvatar from "../ui/c-avatar";
import { useConversa } from "@/app/contexts/conversas-provider";
import { useAuth } from "@/app/contexts/auth-provider";

interface ConversaCardProps {
  conversaUsuario: IConversaUsuario;
  load: () => Promise<void>;
}

const ConversaCard = ({ conversaUsuario, load }: ConversaCardProps) => {
  const [mensagens, setMensagens] = useState<IMensagem[]>(
    conversaUsuario.mensagens ?? []
  );
  const [mensagensVisualizadas, setMensagensVisualizadas] = useState<
    IMensagem[]
  >(conversaUsuario.mensagens ?? []);
  const { conversasContext } = useConversa();
  const { auth } = useAuth();

  const visualizarTodasMensagens = async () => {
    try {
      const data = await visualizarMensagens(mensagensVisualizadas);
      if (data.erro) {
        console.error(data.mensagemApi);
        toast.error(data.mensagem);
      }
      setMensagensVisualizadas([]);
      await load();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const recarregarMensagens = () => {
      const conversaAtual = conversasContext.find(
        (c: IConversaUsuario) => c.conversaId === conversaUsuario.conversaId
      );
      setMensagens(conversaAtual?.mensagens ?? []);
    };
    recarregarMensagens();
  }, [conversasContext, conversaUsuario.conversaId]);

  useEffect(() => {
    const mensagensVisualizadas = () => {
      const mensagens = conversaUsuario.mensagens?.filter(
        (mensagem) =>
          !mensagem.visualizada && mensagem.usuarioId !== auth.usuarioId
      );
      if (mensagens) {
        setMensagensVisualizadas(mensagens);
      }
    };
    mensagensVisualizadas();
  }, [conversaUsuario.mensagens, auth.usuarioId]);

  return (
    <>
      <div
        key={conversaUsuario.conversaId}
        onClick={() => visualizarTodasMensagens()}
      >
        <Link
          href={`/conversas/${conversaUsuario.conversaId}`}
          className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col gap-2  border-b p-4 text-sm leading-tight"
        >
          <div className="flex items-center w-full">
            <CAvatar
              src={formatarUrlAnexo(
                "conversa",
                "perfil",
                conversaUsuario.conversaId!,
                conversaUsuario.conversaFoto ?? null
              )}
              alt={conversaUsuario.conversaNome!}
            />
            <div className="flex items-center ml-2 justify-between w-full">
              <span className="label-medium">
                {conversaUsuario.conversaNome}
              </span>
              {mensagensVisualizadas.length > 0 && (
                <Badge
                  variant="default"
                  className="h-5 min-w-5 rounded-full px-1 text-xs shrink-0 whitespace-nowrap"
                >
                  {mensagensVisualizadas.length}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between w-full">
            {mensagens && mensagens.length > 0 && (
              <span className="w-45 label-small mr-2">
                {mensagens[0].mensagem}
              </span>
            )}

            {mensagens && mensagens.length > 0 && (
              <span
                style={{ fontSize: "10px" }}
                className="shrink-0 whitespace-nowrap"
              >
                {formatarData(mensagens[0].regidh!, "dataehoratexto")}
              </span>
            )}
          </div>
        </Link>
      </div>
    </>
  );
};

export default ConversaCard;
