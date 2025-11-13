import z from "zod";
import { IConversa } from "../../types/conversas";
import CAvatar from "../ui/c-avatar";
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
import { useState } from "react";
import { PencilIcon } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { alterarConversa } from "../../_actions/conversas";

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
  const [editar, setEditar] = useState<boolean>(false);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [conversaFoto, setConversaFoto] = useState<File | null>(null);
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
            String(c.usuario?.usuarioId)
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
    setEditar(false);
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
              <CAvatar
                width="w-[150px]"
                height="h-[150px]"
                src={`${
                  process.env.NEXT_PUBLIC_APP_URL
                }/uploads/conversas/conversa_${
                  conversa.conversaId
                }/perfil/${conversa.conversaUsuarios![0].conversaFoto!}`}
                alt={conversa.conversaUsuarios![0].conversaNome!}
              />
              {editar ? (
                <Form {...form}>
                  <form
                    className="w-full"
                    onSubmit={form.handleSubmit(onSubmit)}
                  >
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
                    {editar && (
                      <div className="flex items-center mt-5 gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => setEditar(!editar)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          loading={carregando}
                          className="text"
                          type="submit"
                        >
                          Salvar
                        </Button>
                      </div>
                    )}
                  </form>
                </Form>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xl text-primary font-medium">
                    {conversa.conversaUsuarios![0].conversaNome!}
                  </span>
                  {conversa.grupo ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditar(!editar)}
                    >
                      <PencilIcon className="text-primary" />
                    </Button>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default ConversaEditar;
