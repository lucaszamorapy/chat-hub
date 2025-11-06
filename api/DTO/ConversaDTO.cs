namespace api.DTO
{
    public class ConversaDTO
    {
        public string Grupo { get; set; }
        public List<ConversaUsuarioDTO> ConversaUsuarios { get; set; } = new();
    }

}
