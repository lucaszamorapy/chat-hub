export interface IMensagem {
  mensagemId?: number;
  conversaId: number;
  usuarioId: number;
  mensagem: string;
  regidh: Date;
  regiusu: number;
  regadh?: Date;
  regausu?: number
}