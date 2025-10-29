import { IMensagem } from "../mensagens";

export interface IConversa {
  conversaId?: number;
  usuarioId?: number;
  conversaNome: string;
  conversaFoto: string;
  grupo: boolean;
  mensagens: IMensagem[];
  regidh: Date;
  regiusu: number;
  regadh?: Date;
  regausu?: number
}