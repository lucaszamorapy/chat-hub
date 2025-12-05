"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontalIcon, UserCheck, UserStar, UserX } from "lucide-react";
import { toast } from "sonner";
import { IConversaUsuario } from "../../types/conversas";
import CAvatar from "../ui/c-avatar";
import { useAuth } from "@/app/contexts/auth-provider";
import {
  alterarConversaUsuarios,
  excluirConversaUsuarios,
} from "@/app/actions/conversas";
import { useRouter } from "next/navigation";
import { useConversa } from "@/app/contexts/conversas-provider";
import { formatarUrlAnexo } from "@/app/utils";

interface ConversaUsuarioCardProps {
  conversaUsuario: IConversaUsuario;
  conversaId: number;
  isAdmin: boolean;
  atualizar?: () => Promise<void>;
}

const ConversaUsuarioCard = ({
  conversaUsuario,
  conversaId,
  isAdmin,
  atualizar,
}: ConversaUsuarioCardProps) => {
  const { auth } = useAuth();
  const { removerConversa } = useConversa();
  const rota = useRouter();

  const removerConversaUsuario = async () => {
    try {
      const data = await excluirConversaUsuarios(conversaUsuario);
      if (!data.erro) {
        if (atualizar) {
          atualizar();
          if (auth.usuarioId === conversaUsuario.usuarioId) {
            rota.push("/");
            removerConversa(conversaId);
          }
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
  const alterarConversaUsuario = async () => {
    try {
      const data = await alterarConversaUsuarios({
        ...conversaUsuario,
        cargo: conversaUsuario.cargo === "Admin" ? "Membro" : "Admin",
      });
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

  return (
    <div className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col gap-2 border-b p-4 text-sm leading-tight last:border-b-0">
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-2">
          <CAvatar
            src={formatarUrlAnexo(
              "usuario",
              "perfil",
              conversaUsuario.usuarioId!,
              conversaUsuario.usuarioPerfilFoto ?? null
            )}
            alt={conversaUsuario.conversaUsuariosId!}
          />
          {auth.usuarioId === conversaUsuario.usuarioId ? (
            <div className="flex flex-col w-full">
              <span className="font-medium truncate">Você</span>
              <span className="text-xs truncate">
                {conversaUsuario.usuarioApelido}
              </span>
            </div>
          ) : (
            <div className="flex flex-col w-full">
              <span className="font-medium truncate">
                {conversaUsuario.usuarioNome}
              </span>
              <span className="text-xs truncate">
                {conversaUsuario.usuarioApelido}
              </span>
            </div>
          )}
        </div>
        {(auth.usuarioId === conversaUsuario.usuarioId || isAdmin) && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" aria-label="Open menu" size="icon-sm">
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
              {auth.usuarioId !== conversaUsuario.usuarioId && isAdmin && (
                <DropdownMenuItem
                  className="text-xs cursor-pointer"
                  onSelect={alterarConversaUsuario}
                >
                  {conversaUsuario.cargo !== "Admin" ? (
                    <div className="flex w-full justify-between">
                      <span>Torná-lo Admin</span>
                      <UserCheck className="text-primary" size={1} />
                    </div>
                  ) : (
                    <div className="flex w-full justify-between">
                      <span>Torná-lo Membro</span>
                      <UserStar className="text-primary" size={1} />
                    </div>
                  )}
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                className="text-xs cursor-pointer"
                onSelect={removerConversaUsuario}
              >
                <div className="flex w-full justify-between">
                  <span>
                    {auth.usuarioId === conversaUsuario.usuarioId
                      ? "Sair do grupo"
                      : auth.usuarioId !== conversaUsuario.usuarioId && isAdmin
                      ? "Remover do grupo"
                      : null}
                  </span>
                  <UserX className="text-destructive" size={1} />
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default ConversaUsuarioCard;
