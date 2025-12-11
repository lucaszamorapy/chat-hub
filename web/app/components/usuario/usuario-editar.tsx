import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Eye, EyeOff, Settings } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/app/contexts/auth-provider";
import z from "zod";
import { IUsuario } from "@/app/types/usuarios";
import { FieldGroup } from "../ui/field";
import InputFile from "../ui/input-file";
import { Input } from "../ui/input";
import { formatarUrlAnexo } from "@/app/utils";
import { alterar, getUsuario } from "@/app/actions/usuarios";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um e-mail válido.",
  }),
  nome: z.string().min(1, { message: "Por favor, preencha o seu nome." }),
  apelido: z.string().min(1, { message: "Por favor, preencha o seu apelido." }),
  senha: z.string().min(6, {
    message:
      "Confirme sua senha ou altere, a senha deve conter no mínimo 6 dígitos.",
  }),
});
const UsuarioEditar = () => {
  const [carregando, setCarregando] = useState<boolean>(false);
  const [perfilFoto, setPerfilFoto] = useState<File | null>(null);
  const [usuario, setUsuario] = useState<IUsuario | null>(null);
  const [visualizar, setVisualizar] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const { auth, setAuth } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchUsuario = async () => {
      setCarregando(true);
      if (auth.usuarioId) {
        try {
          const data = await getUsuario(auth.usuarioId);
          if (!data.erro) {
            setUsuario(data.resultado);
            form.reset({
              email: data.resultado.email,
              nome: data.resultado.nome,
              apelido: data.resultado.apelido,
              senha: "",
            });
          } else {
            console.error(data.mensagemApi);
            toast.error(data.mensagem);
          }
        } catch (error) {
          console.error(error);
        }
      }
      setCarregando(false);
    };
    fetchUsuario();
  }, [auth.usuarioId, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setCarregando(true);
    try {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("nome", values.nome);
      formData.append("apelido", values.apelido);
      formData.append("senha", values.senha);

      if (perfilFoto) {
        formData.append("perfilFoto", perfilFoto);
      }
      const data = await alterar(auth.usuarioId!, formData);
      if (!data.erro) {
        setAuth({
          nome: data.resultado.nome,
          usuarioId: data.resultado.usuarioId,
          apelido: data.resultado.apelido,
          perfilFoto: data.resultado.perfilFoto,
        });
        localStorage.setItem(
          "usuario",
          JSON.stringify({
            nome: data.resultado.nome,
            usuarioId: data.resultado.usuarioId,
            apelido: data.resultado.apelido,
            perfilFoto: data.resultado.perfilFoto,
          })
        );
        toast.success(data.mensagem);
        setUsuario({ ...data.resultado });
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
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="text-primary " />
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-5">
        <DialogHeader>
          <DialogTitle className="title">
            Configurações <span className="text-primary">Usuário</span>
          </DialogTitle>
          <DialogDescription>
            Altere suas configurações abaixo
          </DialogDescription>
        </DialogHeader>
        {usuario && (
          <Form {...form}>
            <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <div className="flex w-full flex-col items-center justify-center gap-5">
                  <InputFile
                    label="Foto de Perfil"
                    width="w-[150px]"
                    height="h-[150px]"
                    url={formatarUrlAnexo(
                      "usuario",
                      "perfil",
                      usuario.usuarioId!,
                      usuario.perfilFoto! ?? null
                    )}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setPerfilFoto(e.target.files[0]);
                      }
                    }}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="chathub@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apelido"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apelido</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite seu apelido de usuário"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-5">
                  <FormField
                    control={form.control}
                    name="senha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <div className="w-full relative">
                            <Input
                              type={visualizar ? "text" : "password"}
                              className="w-full relative"
                              placeholder="Digite sua senha"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-0"
                              onClick={() => setVisualizar(!visualizar)}
                            >
                              {visualizar ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  {carregando ? (
                    <Button loading={carregando} className="text-white">
                      Salvando
                    </Button>
                  ) : (
                    <Button className="text-white" type="submit">
                      Salvar
                    </Button>
                  )}
                </div>
              </FieldGroup>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UsuarioEditar;
