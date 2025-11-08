"use client";

import { IAmigo } from "../types/amigos";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  MoreHorizontalIcon,
  SendHorizonal,
  UserCheck,
  UserRoundX,
} from "lucide-react";
import { criarConversa } from "../_actions/conversas";
import { toast } from "sonner";
import { IConversa, IConversaUsuario } from "../types/conversas";
import { useRouter } from "next/navigation";
import { alterarAmigo, excluirAmigo } from "../_actions/amigos";
import { useAuth } from "../contexts/auth-provider";
import CAvatar from "./ui/c-avatar";

interface AmigoProps {
  amigo: IAmigo;
  status?: string;
  atualizar?: () => void;
}

const AmigoCard = ({ amigo, status, atualizar }: AmigoProps) => {
  const rota = useRouter();
  const { auth } = useAuth();

  const iniciarConversa = async () => {
    try {
      const usuarios = [amigo.usuarioId, amigo.usuarioAmigoId!];
      let novaConversa: IConversa = {
        grupo: 0,
      };
      const novaConversaUsuario: IConversaUsuario[] = usuarios.map(
        (usuario: number) => ({
          usuarioId: usuario,
          cargo: "Admin",
        })
      );

      novaConversa = { ...novaConversa, conversaUsuarios: novaConversaUsuario };

      const formData = new FormData();
      formData.append("grupo", novaConversa.grupo.toString());

      novaConversa.conversaUsuarios!.forEach((usuario, index) => {
        formData.append(
          `conversaUsuarios[${index}].usuarioId`,
          usuario.usuarioId.toString()
        );
        formData.append(`conversaUsuarios[${index}].cargo`, usuario.cargo);
      });
      const conversa = await criarConversa(formData);
      if (!conversa.erro) {
        rota.push(`/conversas/${conversa.resultado.conversaId}`);
      } else {
        console.error(conversa.mensagemApi);
        toast.error(conversa.mensagem);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        toast.error(error.message);
      } else {
        console.error("Ocorreu um erro:", error);
      }
    }
  };
  const removerAmigo = async () => {
    try {
      const data = await excluirAmigo(amigo.amigoId!);
      if (!data.erro) {
        if (atualizar) {
          atualizar();
        }
        toast.success(data.mensagem);
      } else {
        console.error(data.mensagemApi);
        toast.error(data.mensagem);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        toast.error(error.message);
      } else {
        console.error("Ocorreu um erro:", error);
      }
    }
  };

  const aceitarAmigo = async () => {
    try {
      const amigoAceito: IAmigo = {
        ...amigo,
        status: "Aceito",
      };
      const data = await alterarAmigo(amigoAceito);
      if (!data.erro) {
        if (atualizar) {
          atualizar();
          toast.success(data.mensagem);
        }
      } else {
        console.error(data.mensagemApi);
        toast.error(data.mensagem);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        toast.error(error.message);
      } else {
        console.error("Ocorreu um erro:", error);
      }
    }
  };

  return (
    <>
      <div key={amigo.amigoId}>
        <div className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col gap-2 border-b p-4 text-sm leading-tight last:border-b-0">
          <div className="flex w-full justify-between">
            <div className="flex items-center gap-2">
              <CAvatar
                src={`${process.env.NEXT_PUBLIC_APP_URL}/uploads/usuarios/usuario_${amigo.usuarioAmigoId}/perfil/${amigo.perfilFotoAmigo}`}
                alt={amigo.apelidoAmigo!}
              />

              <div className="flex flex-col w-full">
                <span className="font-medium truncate">{amigo.nomeAmigo}</span>
                <span className="text-xs truncate">{amigo.apelidoAmigo}</span>
              </div>
            </div>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" aria-label="Open menu" size="icon-sm">
                  <MoreHorizontalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="end">
                <DropdownMenuGroup>
                  {status === "Aceito" && (
                    <DropdownMenuItem
                      className="text-xs cursor-pointer"
                      onSelect={() => iniciarConversa()}
                    >
                      <div className="flex w-full justify-between">
                        <span>Iniciar conversa</span>
                        <SendHorizonal className="text-primary" size={1} />
                      </div>
                    </DropdownMenuItem>
                  )}
                  {auth.usuarioId === amigo.usuarioAmigoId &&
                    status === "Pendente" && (
                      <DropdownMenuItem
                        className="text-xs cursor-pointer"
                        onSelect={aceitarAmigo}
                      >
                        <div className="flex w-full justify-between">
                          <span>Aceitar pedido</span>
                          <UserCheck className="text-primary" size={1} />
                        </div>
                      </DropdownMenuItem>
                    )}
                  <DropdownMenuItem
                    className="text-xs cursor-pointer"
                    onSelect={removerAmigo}
                  >
                    <div className="flex w-full justify-between">
                      {status === "Aceito" ? (
                        <span>Excluir amigo</span>
                      ) : (
                        <span>Cancelar pedido</span>
                      )}
                      <UserRoundX className="text-destructive " size={1} />
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
};

export default AmigoCard;
