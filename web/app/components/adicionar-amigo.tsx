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
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getUsuarios } from "../_actions/usuarios";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { adicionarAmigo } from "../_actions/amigos";
import { IAmigo } from "../types/amigos";

interface AdicionarAmigoProps {
  amigosIds: number[];
  getAmigos: () => Promise<void>;
  usuarioId: number;
}

const AdicionarAmigo = ({
  amigosIds,
  getAmigos,
  usuarioId,
}: AdicionarAmigoProps) => {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [usuariosClone, setUsuariosClone] = useState<IUsuario[]>([]);
  const [carregando, setCarregando] = useState<boolean>(false);

  const getAllUsuarios = useCallback(async () => {
    try {
      const data = await getUsuarios();
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        toast.error(error.message);
      } else {
        console.error("Ocorreu um erro:", error);
      }
    }
  }, [amigosIds, usuarioId]);

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
    const fetchUsuarios = async () => {
      await getAllUsuarios();
    };
    fetchUsuarios();
  }, [getAllUsuarios]);

  return (
    <Dialog>
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
            usuarios.map((usuario: IUsuario) => (
              <div
                key={usuario.usuarioId}
                className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col gap-2 border-b p-4 text-sm leading-tight last:border-b-0"
              >
                <div className="flex w-full justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-8 mr-3 w-8 rounded-lg">
                      <AvatarImage
                        src={usuario.perfilFoto}
                        alt={usuario.apelido}
                      />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>

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
            ))
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
