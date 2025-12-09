import SenhaStepForm from "../components/usuario/senha/senha-step-form";
import UsuarioTemplate from "../components/usuario/usuario-template";

const EsqueciMinhaSenha = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <UsuarioTemplate>
          <SenhaStepForm />
        </UsuarioTemplate>
      </div>
    </div>
  );
};

export default EsqueciMinhaSenha;
