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
