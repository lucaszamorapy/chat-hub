import { IMensagem } from "../mensagens";

export interface IConversa {
  conversaId?: number;
  usuarioId?: number;
  conversaNome: string;
  conversaFoto?: string | null;
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
  usuarioId: number;
  conversaId?: number;
  usuarioEntrou?: Date;
  cargo: "Membro" | "Admin"
}