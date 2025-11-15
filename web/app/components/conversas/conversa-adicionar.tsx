"use client";

import { UserRoundMinus, UserRoundPlus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getUsuarios } from "../../_actions/usuarios";
import { Input } from "../ui/input";
import { IAmigo } from "../../types/amigos";
import { Skeleton } from "../ui/skeleton";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useRouter } from "next/navigation";
import { criarConversa } from "../../_actions/conversas";
import { IConversaUsuario } from "../../types/conversas";
import { useAuth } from "../../contexts/auth-provider";
import CAvatar from "../ui/c-avatar";
import InputFile from "../ui/input-file";

interface ConversaAdicionarProps {
  getAmigos: () => Promise<IAmigo[]>;
  getConversas: () => Promise<void>;
  usuarioId: number;
}

const formSchema = z.object({
  conversaNome: z
    .string()
    .min(1, { message: "Por favor, preencha o nome do grupo." }),
});

const ConversaAdicionar = ({
  getAmigos,
  getConversas,
  usuarioId,
}: ConversaAdicionarProps) => {
  const [amigos, setAmigos] = useState<IAmigo[]>([]);
  const [amigosClone, setAmigosClone] = useState<IAmigo[]>([]);
  const [amigosSelecionados, setAmigosSelecionados] = useState<number[]>([]);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [grupoFoto, setGrupoFoto] = useState<File | null>(null);
  const { auth } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      conversaNome: "",
    },
  });

  const rota = useRouter();

  const filtrar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value.toLowerCase();
    const amigosFiltrados = amigosClone.filter(
      (amigo: IAmigo) =>
        amigo.apelidoAmigo!.toLowerCase().includes(valor) ||
        amigo.apelidoAmigo!.toLowerCase().includes(valor)
    );
    setAmigos(amigosFiltrados || amigosClone);
  };

  const amigosGrupo = useCallback(
    (id: number | null, tipo: "adicionar" | "remover" | "limpar") => {
      if (tipo === "adicionar") {
        setAmigosSelecionados((prev) => [...prev, id!]);
      } else if (tipo === "remover") {
        setAmigosSelecionados((prev) =>
          prev.filter((amigoId) => amigoId !== id)
        );
      } else {
        setAmigosSelecionados([]);
      }
    },
    []
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setCarregando(true);
    try {
      const novosAmigos = [...amigosSelecionados, auth.usuarioId!];

      if (amigosSelecionados.length === 0) {
        setCarregando(false);
        return toast.error(
          "Por favor, selecione pelo menos um amigo para o seu grupo."
        );
      }
      const novaConversaUsuario: IConversaUsuario[] = novosAmigos.map(
        (amigo: number) => {
          return {
            usuarioId: amigo,
            cargo: "Admin",
          };
        }
      );
      const formData = new FormData();
      formData.append("grupo", String(1));
      novaConversaUsuario.forEach((amigo, index) => {
        formData.append(
          `conversaUsuarios[${index}].conversaNome`,
          values.conversaNome
        );
        formData.append(
          `conversaUsuarios[${index}].usuarioId`,
          amigo.usuarioId.toString()
        );
        formData.append(`conversaUsuarios[${index}].cargo`, amigo.cargo);
        if (grupoFoto) {
          formData.append(`conversaUsuarios[${index}].conversaFoto`, grupoFoto);
        }
      });
      const data = await criarConversa(formData);
      if (!data.erro) {
        await getConversas();
        rota.push(`/conversas/${data.resultado.conversaId}`);
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
    setCarregando(false);
    amigosGrupo(null, "limpar");
    form.reset();
    setOpen(false);
  };

  useEffect(() => {
    if (!open) {
      setTimeout(() => amigosGrupo(null, "limpar"), 0);
    }
  }, [open, amigosGrupo]);

  useEffect(() => {
    if (open) {
      const fetchUsuarios = async () => {
        setCarregando(true);
        const data = await getUsuarios();
        const amigos = await getAmigos();

        if (!data.erro) {
          setAmigos(
            amigos.filter((amigo: IAmigo) => amigo.status === "Aceito")
          );
          setAmigosClone(amigos);
        } else {
          toast.error(data.mensagem);
        }

        setCarregando(false);
      };

      fetchUsuarios();
    }
  }, [open, usuarioId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <UserRoundPlus className="text-primary " />
        </Button>
      </DialogTrigger>
      <DialogContent style={{ height: "77%" }} className="gap-5">
        <DialogHeader>
          <DialogTitle className="text-black">
            Adicionar <span className="text-primary">Grupo</span>
          </DialogTitle>
          <DialogDescription>
            Crie um grupo com os seus amigos favoritos.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="gap-5" onSubmit={form.handleSubmit(onSubmit)}>
            <InputFile
              style="mt-5 mb-5"
              label="Foto do Grupo"
              width="w-30"
              height="h-30"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files.length > 0) {
                  setGrupoFoto(e.target.files[0]);
                }
              }}
            />
            <FormField
              control={form.control}
              name="conversaNome"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome do grupo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Input
              placeholder="Procure seu amigo aqui..."
              onChange={(e) => filtrar(e)}
            ></Input>
            <div
              className={`${
                amigos.length > 0 ? "overflow-y-scroll" : ""
              } mt-5 h-60`}
            >
              {amigos && amigos.length > 0 ? (
                amigos.map((amigo: IAmigo) => {
                  if (carregando) {
                    return (
                      <div
                        key={amigo.usuarioAmigoId}
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
                        key={amigo.usuarioAmigoId}
                        className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col gap-2 border-b p-4 text-sm leading-tight last:border-b-0"
                      >
                        <div className="flex w-full justify-between">
                          <div className="flex gap-2">
                            <CAvatar
                              src={`${
                                process.env.NEXT_PUBLIC_APP_URL
                              }/uploads/usuarios/usuario_${
                                amigo.usuarioAmigoId !== auth.usuarioId
                                  ? amigo.usuarioAmigoId
                                  : amigo.usuarioId
                              }/perfil/${amigo.perfilFotoAmigo}`}
                              alt={amigo.apelidoAmigo!}
                            />
                            <div className="flex flex-col w-full">
                              <span className="font-medium truncate">
                                {amigo.nomeAmigo}
                              </span>
                              <span className="text-xs truncate">
                                {amigo.apelidoAmigo}
                              </span>
                            </div>
                          </div>
                          <div className="flex ">
                            {!amigosSelecionados.includes(
                              amigo.usuarioAmigoId !== auth.usuarioId
                                ? amigo.usuarioAmigoId!
                                : amigo.usuarioId!
                            ) ? (
                              <Button
                                type="button"
                                loading={carregando}
                                variant={"ghost"}
                                onClick={() =>
                                  amigosGrupo(
                                    amigo.usuarioAmigoId !== auth.usuarioId
                                      ? amigo.usuarioAmigoId!
                                      : amigo.usuarioId!,
                                    "adicionar"
                                  )
                                }
                              >
                                <UserRoundPlus
                                  className="text-primary"
                                  size={1}
                                />
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                loading={carregando}
                                variant={"ghost"}
                                onClick={() =>
                                  amigosGrupo(
                                    amigo.usuarioAmigoId !== auth.usuarioId
                                      ? amigo.usuarioAmigoId!
                                      : amigo.usuarioId!,
                                    "remover"
                                  )
                                }
                              >
                                <UserRoundMinus
                                  className="text-primary"
                                  size={1}
                                />
                              </Button>
                            )}
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
            <div className="flex items-end mt-5 w-full flex-col gap-2">
              {carregando ? (
                <Button loading={carregando} className="text-white ">
                  Adicionando
                </Button>
              ) : (
                <Button className="text-white" type="submit">
                  Adicionar
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ConversaAdicionar;
