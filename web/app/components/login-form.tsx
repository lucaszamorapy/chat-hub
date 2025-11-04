"use client";

import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { FieldDescription, FieldGroup } from "@/app/components/ui/field";
import { Input } from "@/app/components/ui/input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "../_actions/usuarios";
import { useAuth } from "../contexts/auth-provider";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  apelido: z.string().min(1, { message: "Por favor, preencha o seu apelido." }),
  senha: z.string().min(6, {
    message: "A senha deve conter no mínimo 6 dígitos.",
  }),
});

const LoginForm = ({ className, ...props }: React.ComponentProps<"div">) => {
  const [visualizar, setVisualizar] = useState<boolean>(false);
  const [carregando, setCarregando] = useState<boolean>(false);
  const { setAuth } = useAuth();
  const rota = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apelido: "",
      senha: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setCarregando(true);
    try {
      const data = await login(values);
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
      } else {
        console.error(data.mensagem);
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
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">
                    Bem-vindo(a){" "}
                    <span className="text-primary">novamente!</span>
                  </h1>
                  <p className="text-muted-foreground text-balance font-sx">
                    Entre em sua conta do ChatHub
                  </p>
                </div>
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
                  <FieldDescription className="flex justify-end items-end">
                    <Link href={"#"}>Esqueceu sua senha?</Link>
                  </FieldDescription>
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
                      Entrando
                    </Button>
                  ) : (
                    <Button className="text-white" type="submit">
                      Entrar
                    </Button>
                  )}
                </div>
                <FieldDescription className="text-center">
                  Não tem uma conta no ChatHub?{" "}
                  <Link href={"/cadastro"}>Cadastre-se</Link>
                </FieldDescription>
              </FieldGroup>
            </form>
          </Form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Desenvolvido por{" "}
        <Link target="_blank" href="https://github.com/lucaszamorapy">
          Lucas Zamora
        </Link>
      </FieldDescription>
    </div>
  );
};

export default LoginForm;
