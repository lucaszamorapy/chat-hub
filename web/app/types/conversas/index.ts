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
  conversaUsuarioId?: string;
  conversaNome?: string;
  usuarioId: number;
  mensagens?: IMensagem[];
  conversaId?: number;
  usuarioEntrou?: Date;
  conversaFoto?: string | null;
  cargo: "Membro" | "Admin"
}