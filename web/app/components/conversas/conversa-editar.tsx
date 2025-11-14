import z from "zod";
import { IConversa, IConversaUsuario } from "../../types/conversas";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
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
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { alterarConversa } from "../../_actions/conversas";
import InputFile from "../ui/input-file";
import ConversaUsuarioCard from "./conversa-usuario-card";
import { useAuth } from "@/app/contexts/auth-provider";
import { Label } from "../ui/label";

interface ConversaEditarProps {
  open: boolean;
  conversa: IConversa;
  setOpen: (value: boolean) => void;
  load: () => Promise<void>;
}

const formSchema = z.object({
  conversaNome: z.string().min(6, {
    message: "O nome da conversa deve conter no mínimo 6 dígitos.",
  }),
});

const ConversaEditar = ({
  open,
  setOpen,
  conversa,
  load,
}: ConversaEditarProps) => {
  const [carregando, setCarregando] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [conversaFoto, setConversaFoto] = useState<File | null>(null);
  const { auth } = useAuth();

  useEffect(() => {
    const permissaoUsuario = () => {
      if (!conversa.conversaUsuarios) return;
      const usuario = conversa.conversaUsuarios.find(
        (c: IConversaUsuario) => c.usuarioId === auth.usuarioId
      );
      setIsAdmin(usuario?.cargo === "Admin" ? true : false);
    };
    permissaoUsuario();
  }, [auth.usuarioId, conversa.conversaUsuarios]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: conversa.conversaUsuarios
      ? {
          conversaNome: conversa.conversaUsuarios[0].conversaNome,
        }
      : {
          conversaNome: "",
        },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setCarregando(true);
    try {
      const formData = new FormData();
      formData.append("grupo", String(conversa.grupo));
      if (conversa.conversaUsuarios) {
        conversa.conversaUsuarios.forEach((c, index) => {
          formData.append(
            `conversaUsuarios[${index}].conversaNome`,
            values.conversaNome
          );
          formData.append(
            `conversaUsuarios[${index}].usuarioId`,
            String(c.usuarioId)
          );
          formData.append(`conversaUsuarios[${index}].cargo`, c.cargo);

          if (conversaFoto) {
            formData.append(
              `conversaUsuarios[${index}].conversaFoto`,
              conversaFoto
            );
          }
        });
      }

      const data = await alterarConversa(conversa.conversaId!, formData);
      if (!data.erro) {
        toast.success(data.mensagem);
        await load();
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
    form.reset();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            Dados da <span className="text-primary">conversa</span>
          </SheetTitle>

          <div className="flex w-full flex-col items-center justify-center mt-5">
            <div className="flex w-full flex-col items-center justify-center gap-5">
              <InputFile
                url={`${
                  process.env.NEXT_PUBLIC_APP_URL
                }/uploads/conversas/conversa_${
                  conversa.conversaId
                }/perfil/${conversa.conversaUsuarios![0].conversaFoto!}`}
                width="w-[150px]"
                height="h-[150px]"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setConversaFoto(e.target.files[0]);
                  }
                }}
              />

              <Form {...form}>
                <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="conversaNome"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Apelido</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o nome da sua conversa"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center mt-5 gap-2">
                    <Button loading={carregando} className="text" type="submit">
                      Salvar
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
            {conversa.grupo === 1 && (
              <div className="w-full mt-5">
                <Label>Integrantes</Label>
                {conversa.conversaUsuarios &&
                  conversa.conversaUsuarios.map((c: IConversaUsuario) => {
                    return (
                      <ConversaUsuarioCard
                        key={c.conversaUsuariosId}
                        conversaUsuario={c}
                        atualizar={load}
                        isAdmin={isAdmin}
                      />
                    );
                  })}
              </div>
            )}
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default ConversaEditar;
