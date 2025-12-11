"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/app/components/ui/sidebar";
import { IAuth } from "../contexts/auth-provider";
import { logout } from "../actions/usuarios";
import CAvatar from "./ui/c-avatar";
import { useRouter } from "next/navigation";
import { formatarUrlAnexo } from "../utils";
import UsuarioEditar from "./usuario/usuario-editar";
import { useConversa } from "../contexts/conversas-provider";
import UsuarioCard from "./usuario/usuario-card";

interface UsuariosProps {
  usuario: IAuth;
}

export function NavUser({ usuario }: UsuariosProps) {
  const { isMobile } = useSidebar();
  const { setConversasContext } = useConversa();
  const rota = useRouter();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0"
            >
              <CAvatar
                src={formatarUrlAnexo(
                  "usuario",
                  "perfil",
                  usuario.usuarioId!,
                  usuario.perfilFoto ?? null
                )}
                alt={usuario.apelido!}
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{usuario.nome}</span>
                <span className="truncate text-xs">{usuario.apelido}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center justify-between gap-2 px-1 py-1.5 text-left text-sm">
                <UsuarioCard
                  usuario={{
                    usuarioId: usuario.usuarioId!,
                    nome: usuario.nome!,
                    apelido: usuario.apelido!,
                    foto: usuario.perfilFoto!,
                  }}
                />
                <UsuarioEditar />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={async () => {
                await logout();
                rota.push("/login");
                setConversasContext([]);
              }}
            >
              <LogOut className="text-primary" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
