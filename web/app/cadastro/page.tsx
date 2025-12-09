import CadastroForm from "../components/usuario/cadastro/cadastro-form";
import UsuarioTemplate from "../components/usuario/usuario-template";

const CadastroPage = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center">
      <div className="w-full max-w-sm md:max-w-4xl">
        <UsuarioTemplate>
          <CadastroForm />
        </UsuarioTemplate>
      </div>
    </div>
  );
};

export default CadastroPage;
