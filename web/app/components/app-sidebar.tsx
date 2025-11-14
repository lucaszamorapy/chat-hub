"use client";

import { Command, MessageCircle, Users2 } from "lucide-react";
import { NavUser } from "@/app/components/nav-user";
import { Label } from "@/app/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/app/components/ui/sidebar";
import { Switch } from "@/app/components/ui/switch";
import Link from "next/link";
import { IConversaUsuario } from "../types/conversas";
import { getConversasByUsuario } from "../_actions/conversas";
import { useAuth } from "../contexts/auth-provider";
import { IAmigo } from "../types/amigos";
import { toast } from "sonner";
import { IMensagem } from "../types/mensagens";
import { useCallback, useEffect, useState } from "react";
import ConversaCard from "./conversas/conversa-card";
import { getAmigosByUsuario } from "../_actions/amigos";
import AmigoAccordion from "./amigos/amigo-accordion";
import AmigoAdicionar from "./amigos/amigo-adicionar";
import ConversaAdicionar from "./conversas/conversa-adicionar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [itemAtivo, setItemAtivo] = useState("Conversas");
  const [conversas, setConversas] = useState<IConversaUsuario[]>();
  const [conversasClone, setConversasClone] = useState<IConversaUsuario[]>();
  const [amigos, setAmigos] = useState<IAmigo[]>();
  const [amigosClone, setAmigosClone] = useState<IAmigo[]>();
  const [filtro, setFiltro] = useState("conversas");
  const { setOpen } = useSidebar();
  const { auth } = useAuth();

  const getConversas = useCallback(async () => {
    try {
      if (auth.usuarioId) {
        const conversasData = await getConversasByUsuario(auth.usuarioId);
        if (!conversasData.erro) {
          setConversas(conversasData.resultado);
          setConversasClone(conversasData.resultado);
        } else {
          console.error(conversasData.mensagemApi);
          toast.error(conversasData.mensagem);
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
  }, [auth.usuarioId]);

  const getAmigos = async () => {
    let resultado;
    try {
      if (auth.usuarioId) {
        const amigosData = await getAmigosByUsuario(auth.usuarioId);
        if (!amigosData.erro) {
          setAmigos(amigosData.resultado);
          setAmigosClone(amigosData.resultado);
        } else {
          console.error(amigosData.mensagemApi);
          toast.error(amigosData.mensagem);
        }
        resultado = amigosData.resultado;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        toast.error(error.message);
      } else {
        console.error("Ocorreu um erro:", error);
      }
      resultado = [];
    }
    return resultado;
  };

  const items = [
    {
      titulo: "Conversas",
      icone: MessageCircle,
      isActive: true,
      filtro: "conversas",
      onClick: getConversas,
    },
    {
      titulo: "Amigos",
      icone: Users2,
      isActive: true,
      filtro: "amigos",
      onClick: getAmigos,
    },
  ];

  const filtrar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value.toLowerCase();
    if (filtro === "conversas") {
      const conversasFiltradas = conversasClone?.filter(
        (conversa: IConversaUsuario) => {
          const nomeInclui = conversa
            .conversaNome!.toLowerCase()
            .includes(valor);
          const mensagemInclui = conversa.mensagens?.some(
            (mensagem: IMensagem) =>
              mensagem.mensagem.toLowerCase().includes(valor)
          );
          return nomeInclui || mensagemInclui;
        }
      );
      setConversas(conversasFiltradas || conversasClone);
    } else {
      const amigosFiltrados = amigosClone?.filter((amigo: IAmigo) => {
        const nomeInclui = amigo.nomeAmigo!.toLowerCase().includes(valor);
        const apelidoInclui = amigo.apelidoAmigo!.toLowerCase().includes(valor);
        return nomeInclui || apelidoInclui;
      });
      setAmigos(amigosFiltrados || amigosClone);
    }
  };

  const filtrarNaoLidas = (ativo: boolean) => {
    const conversasFiltradas = ativo
      ? conversasClone?.filter(
          (conversa: IConversaUsuario) =>
            conversa.mensagens?.some(
              (msg) => !msg.visualizada && msg.usuarioId !== auth.usuarioId
            ) ?? false
        )
      : conversasClone;

    setConversas(conversasFiltradas);
  };

  useEffect(() => {
    const fetchConversas = async () => {
      await getConversas();
    };

    fetchConversas();
  }, [getConversas]);

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <Link href="/">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Command className="size-4" />
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.titulo}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.titulo,
                        hidden: false,
                      }}
                      onClick={() => {
                        setFiltro(item.filtro);
                        setItemAtivo(item.titulo);
                        setOpen(true);
                        return item.onClick();
                      }}
                      isActive={itemAtivo === item.titulo}
                      className="px-2.5 md:px-2 cursor-pointer"
                    >
                      <item.icone />
                      <span>{item.titulo}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser usuario={auth} />
        </SidebarFooter>
      </Sidebar>

      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-foreground text-base font-medium">
                {itemAtivo}
              </span>
              {itemAtivo === "Amigos" && amigos && (
                <AmigoAdicionar
                  getAmigos={async () => await getAmigos()}
                  usuarioId={auth.usuarioId!}
                />
              )}
              {itemAtivo === "Conversas" && (
                <ConversaAdicionar
                  getAmigos={async () => await getAmigos()}
                  getConversas={async () => await getConversas()}
                  usuarioId={auth.usuarioId!}
                />
              )}
            </div>
            {filtro === "conversas" && (
              <Label className="flex items-center gap-2 text-sm">
                <span>Não lidas</span>
                <Switch
                  className="shadow-none"
                  onCheckedChange={(ativo) => filtrarNaoLidas(ativo)}
                />
              </Label>
            )}
          </div>
          <SidebarInput
            onChange={(e) => filtrar(e)}
            placeholder="O que você procura...?"
          />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="p-0 ">
            <SidebarGroupContent>
              {filtro === "conversas" ? (
                conversas && conversas.length > 0 ? (
                  conversas.map((item: IConversaUsuario) => {
                    const mensagensVisualizadas = item.mensagens?.filter(
                      (mensagem) =>
                        !mensagem.visualizada &&
                        mensagem.usuarioId !== auth.usuarioId
                    );
                    return (
                      <ConversaCard
                        key={item.conversaId}
                        conversa={item}
                        mensagensVisualizadas={mensagensVisualizadas!}
                        load={async () => await getConversas()}
                      />
                    );
                  })
                ) : (
                  <div className="p-2 flex justify-center items-center text-xs">
                    Nenhuma conversa encontrada.
                  </div>
                )
              ) : amigos && amigos.length > 0 ? (
                <AmigoAccordion
                  amigos={amigos}
                  getAmigos={async () => await getAmigos()}
                />
              ) : (
                <div className="p-2 flex justify-center items-center text-xs">
                  Nenhum amigo encontrado.
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
