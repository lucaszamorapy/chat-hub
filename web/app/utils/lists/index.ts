import SenhaFormEmail from "@/app/components/usuario/senha/senha-form-email"
import SenhaFormAlterar from "@/app/components/usuario/senha/senha-form-alterar"
import SenhaFormCodigoSenha from "@/app/components/usuario/senha/senha-form-codigo-senha";
import { IStepProps } from "@/app/types/usuarios";

export const rotasPublicas = ["/login", "/cadastro", "/esqueci-minha-senha"]

interface IFaseStep {
  fase: string;
  componente: React.FC<IStepProps>
}
export const fasesStep: IFaseStep[] = [
  {
    fase: "enviarEmail",
    componente: SenhaFormEmail
  },
  {
    fase: "codigoSenha",
    componente: SenhaFormCodigoSenha
  },
  {
    fase: "alterarSenha",
    componente: SenhaFormAlterar
  },
];