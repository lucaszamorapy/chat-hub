namespace api.DTO
{
    public class GrupoesDTO
    {
        public int? GrupoId { get; set; }

        public int ConversaId { get; set; }

        public List<int> UsuariosIds { get; set; }

        public DateTime UsuarioEntrou { get; set; }

        public string Cargo { get; set; } = null!;

        public DateTime Regidh { get; set; }

        public int Regiusu { get; set; }

        public DateTime? Regadh { get; set; }

        public int? Regausu { get; set; }
    }
}
