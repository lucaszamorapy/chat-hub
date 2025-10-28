namespace api.DTO
{
    public class UsuarioDTO
    {
        public int? UsuarioId { get; set; }
        public string? Nome { get; set; }
        public string Apelido { get; set; } = null!;
        public string? Email { get; set; } 
        public string? PerfilFoto { get; set; }
        public string? Status { get; set; }
        public string? Senha { get; set; }
    }
}
