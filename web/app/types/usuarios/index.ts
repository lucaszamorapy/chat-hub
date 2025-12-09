export interface ILogin {
  apelido: string;
  senha: string;
}

export interface IUsuario {
  usuarioId?: number;
  nome: string;
  apelido: string;
  senha: string;
  email: string;
  perfilFoto?: any;
  status?: string;
}

export interface IAlterarSenha {
  usuarioId?: number;
  senha?: string;
  codigoSenha?: number
}

export interface IStepProps {
  avancarStep?: (fase: number, dadosSenha?: IAlterarSenha) => void;
  dadosSenha?: IAlterarSenha;
}

