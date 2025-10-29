export interface IAmigo {
  amigoId?: number;
  usuarioId: number;
  usuarioAmigoId: number;
  status: "Pendente" | "Recusado" | "Aceito";
  regidh: Date;
  regiusu: number;
  regadh?: Date;
  regausu?: number
}