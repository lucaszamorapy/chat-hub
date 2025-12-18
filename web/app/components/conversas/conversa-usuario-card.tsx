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
import { useAuth } from "@/app/contexts/auth-provider";
import {
  alterarConversaUsuarios,
  excluirConversaUsuarios,
} from "@/app/actions/conversas";
import { useRouter } from "next/navigation";
import { useConversa } from "@/app/contexts/conversas-provider";
import UsuarioCard from "../usuario/usuario-card";
import { ApiError } from "@/app/class/index";

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
      }
    } catch (e) {
      const apiError = e as ApiError;
      toast.error(apiError.message);
      console.error(apiError.message);
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
      }
    } catch (e) {
      const apiError = e as ApiError;
      toast.error(apiError.message);
      console.error(apiError.message);
    }
  };

  return (
    <div className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col gap-2 border-b p-4 text-sm leading-tight last:border-b-0">
      <div className="flex w-full justify-between">
        <UsuarioCard
          usuario={{
            usuarioId: conversaUsuario.usuarioId,
            nome: conversaUsuario.usuarioNome!,
            apelido: conversaUsuario.usuarioApelido!,
            foto: conversaUsuario.usuarioPerfilFoto,
          }}
        />
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
