import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { IAmigo } from "../types/amigos";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontalIcon, SendHorizonal, Trash } from "lucide-react";

interface AmigoProps {
  amigo: IAmigo;
}

const AmigoCard = ({ amigo }: AmigoProps) => {
  const iniciarConversa = async () => {};
  const excluirAmigo = async () => {};
  return (
    <>
      <div key={amigo.amigoId}>
        <div className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col gap-2 border-b p-4 text-sm leading-tight last:border-b-0">
          <div className="flex w-full justify-between">
            <div className="flex items-center ">
              <Avatar className="h-8 mr-3 w-8 rounded-lg">
                <AvatarImage
                  src={amigo.perfilFotoAmigo}
                  alt={amigo.apelidoAmigo}
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>

              <div className="flex flex-col items-center w-full">
                <span className="font-medium truncate">{amigo.nomeAmigo}</span>
                <span className="text-xs truncate">{amigo.apelidoAmigo}</span>
              </div>
            </div>
            {amigo.status === "Aceito" && (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    aria-label="Open menu"
                    size="icon-sm"
                  >
                    <MoreHorizontalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="text-xs cursor-pointer"
                      onSelect={() => iniciarConversa()}
                    >
                      <div className="flex w-full justify-between">
                        <span>Iniciar conversa</span>
                        <SendHorizonal className="text-primary" size={1} />
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-xs cursor-pointer"
                      onSelect={() => excluirAmigo()}
                    >
                      <div className="flex w-full justify-between">
                        <span>Excluir amigo</span>
                        <Trash className="text-destructive " size={1} />
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AmigoCard;
