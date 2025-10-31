namespace api.DTO
{
    public class ConversaDTO
    {
        public string ConversaNome { get; set; } = null!;
        public string? ConversaFoto { get; set; }
        public sbyte Grupo { get; set; }
        public List<ConversaUsuarioDTO> ConversaUsuarios { get; set; } = new();
    }

}
