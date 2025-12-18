"use client";

import { Button } from "@/app/components/ui/button";
import { FieldDescription, FieldGroup } from "@/app/components/ui/field";
import { Input } from "@/app/components/ui/input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cadastro } from "../../../actions/usuarios";
import { useAuth } from "../../../contexts/auth-provider";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import InputFile from "../../ui/input-file";
import { ApiError } from "@/app/class/index";

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um e-mail válido.",
  }),
  nome: z.string().min(1, { message: "Por favor, preencha o seu nome." }),
  apelido: z.string().min(1, { message: "Por favor, preencha o seu apelido." }),
  senha: z.string().min(6, {
    message: "A senha deve conter no mínimo 6 dígitos.",
  }),
});

const CadastroForm = () => {
  const [visualizar, setVisualizar] = useState<boolean>(false);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [perfilFoto, setPerfilFoto] = useState<File | null>(null);

  const { setAuth } = useAuth();
  const rota = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      nome: "",
      apelido: "",
      senha: "",
    },
  });

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
      const data = await cadastro(formData);
      if (!data.erro) {
        setAuth({
          nome: data.resultado.usuario.nome,
          usuarioId: data.resultado.usuario.usuarioId,
          apelido: data.resultado.usuario.apelido,
          perfilFoto: data.resultado.usuario.perfilFoto,
        });
        localStorage.setItem("usuario", JSON.stringify(data.resultado.usuario));
        rota.push("/");
        toast.success(data.mensagem);
      }
    } catch (e) {
      const apiError = e as ApiError;
      toast.error(apiError.message);
      console.error(apiError.message);
    }
    setCarregando(false);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">
              Crie sua conta <span className="text-primary">agora!</span>
            </h1>
            <p className="text-muted-foreground text-balance font-sx">
              Preencha os dados abaixo para começar fofocar no ChatHub :)
            </p>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-5">
            <InputFile
              width="w-[150px]"
              height="h-[150px]"
              label="Foto de Perfil"
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
                Cadastrando
              </Button>
            ) : (
              <Button className="text-white" type="submit">
                Cadastrar
              </Button>
            )}
          </div>
          <FieldDescription className="text-center">
            Já tem uma conta no ChatHub?{" "}
            <Link href={"/login"}>Entre agora</Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </Form>
  );
};

export default CadastroForm;
