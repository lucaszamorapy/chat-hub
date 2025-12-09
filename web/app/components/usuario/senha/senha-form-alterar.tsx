"use client";

import { Button } from "@/app/components/ui/button";
import { FieldDescription, FieldGroup } from "@/app/components/ui/field";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import Link from "next/link";
import { toast } from "sonner";
import { IAlterarSenha, IStepProps } from "@/app/types/usuarios";
import { Input } from "../../ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { alterarSenha } from "@/app/actions/usuarios";

const formSchema = z.object({
  senha: z.string().min(6, {
    message: "A senha deve conter no mínimo 6 dígitos.",
  }),
});

const SenhaFormAlterar = ({ dadosSenha }: IStepProps) => {
  const [carregando, setCarregando] = useState<boolean>(false);
  const [visualizar, setVisualizar] = useState<boolean>(false);
  const rota = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      senha: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setCarregando(true);
    const novaSenha: IAlterarSenha = {
      usuarioId: dadosSenha?.usuarioId,
      senha: values.senha,
      codigoSenha: dadosSenha?.codigoSenha,
    };
    try {
      const data = await alterarSenha(novaSenha);
      if (!data.erro) {
        rota.push("/login");
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
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
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
          <div className="flex flex-col gap-2">
            {carregando ? (
              <Button loading={carregando} className="text-white">
                Enviando
              </Button>
            ) : (
              <Button className="text-white" type="submit">
                Enviar
              </Button>
            )}
          </div>
          <FieldDescription className="text-center">
            Lembrou da sua senha do ChatHub?{" "}
            <Link href={"/login"}>Entrar agora</Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </Form>
  );
};

export default SenhaFormAlterar;
