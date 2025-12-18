import CAvatar from "../ui/c-avatar";
import { formatarUrlAnexo } from "@/app/utils";
import { useAuth } from "@/app/contexts/auth-provider";

interface UsuarioCardProps {
  usuario: {
    usuarioId: number;
    foto?: string;
    nome: string;
    apelido: string;
  };
}

const UsuarioCard = ({ usuario }: UsuarioCardProps) => {
  const { auth } = useAuth();
  return (
    <div className="flex items-center gap-2">
      <CAvatar
        src={
          usuario.foto
            ? formatarUrlAnexo(
                "usuario",
                "perfil",
                usuario.usuarioId,
                usuario.foto
              )
            : undefined
        }
        alt={usuario.foto ?? usuario.apelido}
      />
      {auth.usuarioId === usuario.usuarioId ? (
        <div className="flex flex-col w-full">
          <span className="label-medium">Você</span>
          <span className="label-small">{usuario.apelido}</span>
        </div>
      ) : (
        <div className="flex flex-col w-full">
          <span className="label-medium">{usuario.nome}</span>
          <span className="label-small">{usuario.apelido}</span>
        </div>
      )}
    </div>
  );
};

export default UsuarioCard;
