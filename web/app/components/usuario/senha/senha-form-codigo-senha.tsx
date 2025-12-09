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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import Link from "next/link";
import { toast } from "sonner";
import { IStepProps } from "@/app/types/usuarios";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../../ui/input-otp";

const formSchema = z.object({
  codigoSenha: z.string().length(6, {
    message: "Por favor, o código tem que ser de 6 dígitos.",
  }),
});

const SenhaFormCodigoSenha = ({ avancarStep, dadosSenha }: IStepProps) => {
  const [carregando, setCarregando] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigoSenha: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (avancarStep) {
      setCarregando(true);
      if (dadosSenha?.codigoSenha === Number(values.codigoSenha)) {
        setTimeout(() => {
          avancarStep(2);
        }, 2000);
      } else {
        avancarStep(1);
        toast.error("Código fornecido está incorreto");
        setCarregando(false);
      }
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FormField
            control={form.control}
            name="codigoSenha"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center">
                <FormLabel className="items-end">Código</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSeparator />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Digite o código enviado ao seu e-mail.
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

export default SenhaFormCodigoSenha;
