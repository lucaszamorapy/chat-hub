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
import { IConversa } from "../types/conversas";
import { getConversasByUsuario } from "../_actions/conversas";
import { useAuth } from "../contexts/auth-provider";
import { IAmigo } from "../types/amigos";
import { toast } from "sonner";
import { IMensagem } from "../types/mensagens";
import { useCallback, useEffect, useState } from "react";
import ConversaCard from "./conversa-card";

const items = {
  navMain: [
    {
      title: "Conversas",
      icon: MessageCircle,
      isActive: true,
      filtro: "conversas",
    },
    {
      title: "Amigos",
      icon: Users2,
      isActive: true,
      filtro: "amigos",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = useState(items.navMain[0]);
  const [conversas, setConversas] = useState<IConversa[]>();
  const [conversasClone, setConversasClone] = useState<IConversa[]>();
  const [amigos, setAmigos] = useState<IAmigo[]>();
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
          console.error(conversasData.mensagem);
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

  const filtrar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value.toLocaleLowerCase();
    if (filtro === "conversas") {
      const conversasFiltradas = conversasClone?.filter(
        (conversa: IConversa) => {
          const nomeInclui = conversa.conversaNome
            .toLocaleLowerCase()
            .includes(valor);
          const mensagemInclui = conversa.mensagens.some(
            (mensagem: IMensagem) =>
              mensagem.mensagem.toLocaleLowerCase().includes(valor)
          );
          return nomeInclui || mensagemInclui;
        }
      );
      setConversas(conversasFiltradas || conversasClone);
    }
  };

  const filtrarNaoLidas = (ativo: boolean) => {
    const conversasFiltradas = conversasClone?.filter((conversa: IConversa) => {
      const mensagemNaoVisualizada = conversa.mensagens.some((msg) =>
        ativo ? !msg.visualizada : conversasClone
      );
      return mensagemNaoVisualizada;
    });
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
                  <div className="grid flex-1 text-left text-sm leading-tight"></div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {items.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setFiltro(item.filtro);
                        setActiveItem(item);
                        setOpen(true);
                        if (item.title === "Conversas") {
                          getConversas();
                        }
                      }}
                      isActive={activeItem?.title === item.title}
                      className="px-2.5 md:px-2 cursor-pointer"
                    >
                      <item.icon />
                      <span>{item.title}</span>
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
            <div className="text-foreground text-base font-medium">
              {activeItem?.title}
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
        {activeItem.filtro === "conversas" ? (
          <SidebarContent>
            <SidebarGroup className="p-0 border-b">
              <SidebarGroupContent>
                {conversas && conversas.length > 0 ? (
                  conversas.map((item: IConversa) => {
                    const mensagensVisualizadas = item.mensagens.filter(
                      (mensagem) => !mensagem.visualizada
                    );
                    return (
                      <ConversaCard
                        key={item.conversaId}
                        conversa={item}
                        mensagensVisualizadas={mensagensVisualizadas}
                      />
                    );
                  })
                ) : (
                  <div className="p-2 flex justify-center items-center text-xs">
                    Nenhuma conversa encontrada.
                  </div>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        ) : null}
      </Sidebar>
    </Sidebar>
  );
}
