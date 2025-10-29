export interface IMensagem {
  mensagemId?: number;
  conversaId: number;
  usuarioId: number;
  mensagem: string;
  visualizado: Date;
  regidh: Date;
  regiusu: number;
  regadh?: Date;
  regausu?: number
}