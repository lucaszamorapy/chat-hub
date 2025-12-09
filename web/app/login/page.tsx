import LoginForm from "../components/usuario/login/login-form";
import UsuarioTemplate from "../components/usuario/usuario-template";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center ">
      <div className="w-full max-w-sm md:max-w-4xl">
        <UsuarioTemplate>
          <LoginForm />
        </UsuarioTemplate>
      </div>
    </div>
  );
}
