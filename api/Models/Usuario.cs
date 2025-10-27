using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Usuario
{
    public int UsuarioId { get; set; }

    public string Nome { get; set; } = null!;

    public string Apelido { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Senha { get; set; } = null!;

    public string? PerfilFoto { get; set; }

    public string? Status { get; set; }

    public DateTime Regidh { get; set; }

    public int Regiusu { get; set; }

    public DateTime? Regadh { get; set; }

    public int? Regausu { get; set; }

    public virtual ICollection<ConversaUsuario> ConversaUsuarios { get; set; } = new List<ConversaUsuario>();

    public virtual ICollection<Mensagen> Mensagens { get; set; } = new List<Mensagen>();
}
