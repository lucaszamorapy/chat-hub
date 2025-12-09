"use client";

import { Button } from "@/app/components/ui/button";
import { FieldDescription, FieldGroup } from "@/app/components/ui/field";
import { Input } from "@/app/components/ui/input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import Link from "next/link";
import { toast } from "sonner";
import { esqueciMinhaSenha } from "@/app/actions/usuarios";
import { IStepProps } from "@/app/types/usuarios";

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um e-mail válido.",
  }),
});

const SenhaFormEmail = ({ avancarStep }: IStepProps) => {
  const [carregando, setCarregando] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setCarregando(true);
    if (avancarStep) {
      try {
        const data = await esqueciMinhaSenha(values.email);
        if (!data.erro) {
          toast.success(data.mensagem);
          avancarStep(1, data.resultado);
        } else {
          toast.success(data.mensagem);
          avancarStep(0);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
          toast.error(error.message);
        } else {
          console.error("Ocorreu um erro:", error);
        }
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="chathub@exemplo.com" {...field} />
                </FormControl>
                <FormDescription>
                  Informe o e-mail associado à sua conta no ChatHub para
                  enviarmos o código de verificação.
                </FormDescription>
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

export default SenhaFormEmail;
