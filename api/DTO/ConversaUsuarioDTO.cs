namespace api.DTO
{
    public class ConversaUsuarioDTO
    {
        public int UsuarioId { get; set; }
        public string ConversaNome { get; set; } = null!;
        public string Cargo { get; set; } = null!;
        public IFormFile? ConversaFoto { get; set; }
        public DateTime UsuarioEntrou { get; set; }
    }
}
