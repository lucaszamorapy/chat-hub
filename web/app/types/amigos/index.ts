export interface IAmigo {
  amigoId?: number;
  usuarioId: number;
  usuarioAmigoId?: number;
  nome?: string;
  apelido?: string;
  email?: string;
  perfilFoto?: string;
  statusUsuario?: string;
  nomeAmigo?: string;
  apelidoAmigo?: string;
  emailAmigo?: string;
  perfilFotoAmigo?: string;
  statusAmigo?: string;
  status: "Pendente" | "Recusado" | "Aceito";
  regidh: Date;
  regiusu: number;
  regadh?: Date;
  regausu?: number
}