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

interface ConversaUsuarioCardProps {
  conversaUsuario: IConversaUsuario;
  atualizar?: () => Promise<void>;
  isAdmin: boolean;
}

const ConversaUsuarioCard = ({
  conversaUsuario,
  atualizar,
  isAdmin,
}: ConversaUsuarioCardProps) => {
  const { auth } = useAuth();
  const removerConversaUsuario = async () => {};
  const alterarConversaUsuario = async () => {};

  return (
    <div className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col gap-2 border-b p-4 text-sm leading-tight last:border-b-0">
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-2">
          <CAvatar
            src={`${process.env.NEXT_PUBLIC_APP_URL}/uploads/usuarios/usuario_${conversaUsuario.usuarioId}/perfil/${conversaUsuario.usuarioPerfilFoto}`}
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
        {isAdmin && auth.usuarioId !== conversaUsuario.usuarioId && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" aria-label="Open menu" size="icon-sm">
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
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
              <DropdownMenuItem
                className="text-xs cursor-pointer"
                onSelect={removerConversaUsuario}
              >
                <div className="flex w-full justify-between">
                  <span>Remover do grupo</span>
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
