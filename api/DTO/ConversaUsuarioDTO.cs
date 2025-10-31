namespace api.DTO
{
    public class ConversaUsuarioDTO
    {
        public int UsuarioId { get; set; }
        public string Cargo { get; set; } = null!;

        public DateTime UsuarioEntrou { get; set; }
    }
}
