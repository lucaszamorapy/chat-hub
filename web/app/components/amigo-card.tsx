"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
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

interface AmigoProps {
  amigo: IAmigo;
  status?: string;
  removerAmigoLista: (id: number) => void;
  adicionarAmigoLista?: (amigo: IAmigo) => void;
}

const AmigoCard = ({
  amigo,
  status,
  removerAmigoLista,
  adicionarAmigoLista,
}: AmigoProps) => {
  const rota = useRouter();
  const { auth } = useAuth();

  const iniciarConversa = async () => {
    try {
      const usuarios = [amigo.usuarioId, amigo.usuarioAmigoId!];
      let novaConversa: IConversa = {
        conversaNome: amigo.nomeAmigo!,
        conversaFoto: amigo.perfilFotoAmigo ? amigo.perfilFotoAmigo : null,
        grupo: 0,
      };

      console.log(novaConversa);

      const novaConversaUsuario: IConversaUsuario[] = usuarios.map(
        (usuario: number) => ({
          usuarioId: usuario,
          cargo: "Admin",
        })
      );

      novaConversa = { ...novaConversa, conversaUsuarios: novaConversaUsuario };

      const formData = new FormData();
      formData.append("conversaNome", novaConversa.conversaNome);
      formData.append("grupo", novaConversa.grupo.toString());

      if (novaConversa.conversaFoto) {
        formData.append("conversaFoto", novaConversa.conversaFoto);
      }

      novaConversa.conversaUsuarios!.forEach((usuario, index) => {
        formData.append(
          `conversaUsuarios[${index}].usuarioId`,
          usuario.usuarioId.toString()
        );
        formData.append(`conversaUsuarios[${index}].cargo`, usuario.cargo);
      });
      const conversa = await criarConversa(formData);
      if (!conversa.erro) {
        rota.push(`conversa/${conversa.resultado.conversaId}`);
      } else {
        console.error(conversa.mensagem);
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
        removerAmigoLista(amigo.amigoId!);
        toast.success(data.mensagem);
      } else {
        console.error(data.mensagem);
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
        if (adicionarAmigoLista) {
          console.log(data);
          removerAmigoLista(amigo.amigoId!);
          adicionarAmigoLista(data.resultado);
          toast.success(data.mensagem);
        }
      } else {
        console.error(data.mensagem);
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
            <div className="flex items-center ">
              <Avatar className="h-8 mr-3 w-8 rounded-lg">
                <AvatarImage
                  src={
                    auth.usuarioId === amigo.usuarioAmigoId
                      ? amigo.perfilFoto
                      : amigo.perfilFotoAmigo
                  }
                  alt={amigo.apelidoAmigo}
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>

              <div className="flex flex-col items-center w-full">
                <span className="font-medium truncate">
                  {auth.usuarioId === amigo.usuarioAmigoId
                    ? amigo.nome
                    : amigo.nomeAmigo}
                </span>
                <span className="text-xs truncate">
                  {auth.usuarioId === amigo.usuarioAmigoId
                    ? amigo.apelido
                    : amigo.apelidoAmigo}
                </span>
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
                  {auth.usuarioId !== amigo.usuarioId &&
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
