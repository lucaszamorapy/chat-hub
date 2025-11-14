import { IMensagem } from "../mensagens";

export interface IConversa {
  conversaId?: number;
  usuarioId?: number;
  grupo: number;
  mensagens?: IMensagem[];
  conversaUsuarios?: IConversaUsuario[];
  regidh?: Date;
  regiusu?: number;
  regadh?: Date;
  regausu?: number
}

export interface IConversaUsuario {
  conversaUsuariosId?: string;
  conversaNome?: string;
  usuarioId: number;
  usuarioNome?: string;
  usuarioApelido?: string;
  mensagens?: IMensagem[];
  usuarioPerfilFoto?: string;
  conversaId?: number;
  usuarioEntrou?: Date;
  conversaFoto?: string | null;
  cargo: "Membro" | "Admin"
}