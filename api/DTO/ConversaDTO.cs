namespace api.DTO
{
    public class ConversaDTO
    {
        public string ConversaNome { get; set; } = null!;
        public IFormFile? ConversaFoto { get; set; }
        public string Grupo { get; set; }
        public List<ConversaUsuarioDTO> ConversaUsuarios { get; set; } = new();
    }

}
