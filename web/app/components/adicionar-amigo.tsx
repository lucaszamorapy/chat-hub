"use client";

import { MailPlus, UserRoundPlus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { IUsuario } from "../types/usuarios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getUsuarios } from "../_actions/usuarios";
import { Input } from "./ui/input";
import { adicionarAmigo } from "../_actions/amigos";
import { IAmigo } from "../types/amigos";
import { Skeleton } from "./ui/skeleton";
import CAvatar from "./ui/c-avatar";

interface AdicionarAmigoProps {
  getAmigos: () => Promise<IAmigo[]>;
  usuarioId: number;
}

const AdicionarAmigo = ({ getAmigos, usuarioId }: AdicionarAmigoProps) => {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [usuariosClone, setUsuariosClone] = useState<IUsuario[]>([]);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const filtrar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value.toLowerCase();
    const amigosFiltrados = usuariosClone.filter(
      (usuario: IUsuario) =>
        usuario.apelido.toLowerCase().includes(valor) ||
        usuario.nome.toLowerCase().includes(valor)
    );
    setUsuarios(amigosFiltrados || usuariosClone);
  };

  const adicionar = async (usuario: IUsuario) => {
    try {
      setCarregando(true);
      const novoAmigo: IAmigo = {
        usuarioId: usuarioId,
        usuarioAmigoId: usuario.usuarioId,
        status: "Pendente",
      };
      const data = await adicionarAmigo(novoAmigo);
      if (!data.erro) {
        toast.success(data.mensagem);
        const usuariosFiltrados = usuarios.filter(
          (usuario: IUsuario) => usuario.usuarioId !== novoAmigo.usuarioAmigoId
        );
        setUsuarios(usuariosFiltrados);
        await getAmigos();
      } else {
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
    setCarregando(false);
  };

  useEffect(() => {
    if (!open) return;
    const fetchUsuarios = async () => {
      setCarregando(true);
      const data = await getUsuarios();
      const amigos = await getAmigos();
      const amigosIds = amigos.map((a) => a.usuarioAmigoId!);
      const usuariosNaoAmigos = data.resultado.filter(
        (item: IUsuario) =>
          !amigosIds.includes(item.usuarioId!) && usuarioId !== item.usuarioId
      );

      if (!data.erro) {
        setUsuarios(usuariosNaoAmigos);
        setUsuariosClone(usuariosNaoAmigos);
      } else {
        toast.error(data.mensagem);
      }
      setCarregando(false);
    };

    fetchUsuarios();
  }, [open, usuarioId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <UserRoundPlus className="text-primary " />
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-5 h-100">
        <DialogHeader>
          <DialogTitle>
            Adicionar <span className="text-primary">Amigo</span>
          </DialogTitle>
          <DialogDescription>
            Procure e adicione novos amigos abaixo.
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Procure seu amigo aqui..."
          onChange={(e) => filtrar(e)}
        ></Input>
        <div
          className={`${usuarios.length > 0 ? "overflow-y-scroll" : ""} h-60`}
        >
          {usuarios && usuarios.length > 0 ? (
            usuarios.map((usuario: IUsuario) => {
              if (carregando) {
                return (
                  <div
                    key={usuario.usuarioId}
                    className="flex items-center mt-5 space-x-4"
                  >
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    key={usuario.usuarioId}
                    className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col gap-2 border-b p-4 text-sm leading-tight last:border-b-0"
                  >
                    <div className="flex w-full justify-between">
                      <div className="flex items-center">
                        <CAvatar
                          src={`${process.env.NEXT_PUBLIC_APP_URL}/uploads/usuarios/usuario_${usuario.usuarioId}/perfil/${usuario.perfilFoto}`}
                          alt={usuario.apelido}
                        />
                        <div className="flex flex-col items-center w-full">
                          <span className="font-medium truncate">
                            {usuario.nome}
                          </span>
                          <span className="text-xs truncate">
                            {usuario.apelido}
                          </span>
                        </div>
                      </div>
                      <div className="flex ">
                        <Button
                          loading={carregando}
                          variant={"ghost"}
                          onClick={() => adicionar(usuario)}
                        >
                          <MailPlus className="text-primary" size={1} />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              }
            })
          ) : (
            <div className="text-xs text-center text-muted-foreground p-2">
              Nenhum usuário encontrado.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdicionarAmigo;
