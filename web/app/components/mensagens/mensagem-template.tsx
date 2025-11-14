import { CheckCheck } from "lucide-react";
import { useAuth } from "../../contexts/auth-provider";
import { formatarData } from "../../utils";
import { IMensagem } from "@/app/types/mensagens";

interface MensagemTemplateProps {
  mensagem: IMensagem;
  grupo: number;
}

const MensagemTemplate = ({ mensagem, grupo }: MensagemTemplateProps) => {
  const { auth } = useAuth();

  return (
    <div
      className={`flex w-full mb-2 ${
        mensagem.usuarioId === auth.usuarioId ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm shadow-md relative 
          ${
            mensagem.usuarioId === auth.usuarioId
              ? "bg-primary text-white rounded-br-none"
              : "bg-white text-gray-900 rounded-bl-none"
          }
        `}
      >
        {grupo === 1 && mensagem.usuarioId !== auth.usuarioId && (
          <span className="font-medium text-primary">
            {mensagem.usuarioNome}
          </span>
        )}
        <p className="wrap-break-word">{mensagem.mensagem}</p>
        <div
          className={`flex items-center gap-1 text-[10px] mt-1 ${"justify-end text-gray-400"}`}
        >
          <span>{formatarData(mensagem.regidh!, "dataehora")}</span>
          {mensagem.visualizada && mensagem.usuarioId === auth.usuarioId ? (
            <CheckCheck className="w-3 h-3 text-blue-400" />
          ) : (
            <CheckCheck className="w-3 h-3" />
          )}
        </div>
      </div>
    </div>
  );
};

export default MensagemTemplate;
