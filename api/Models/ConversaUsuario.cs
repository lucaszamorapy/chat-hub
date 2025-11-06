using System;
using System.Collections.Generic;

namespace api.Models;

public partial class ConversaUsuario
{
    public int ConversaUsuariosId { get; set; }

    public int ConversaId { get; set; }

    public int UsuarioId { get; set; }

    public string? ConversaFoto { get; set; }

    public string ConversaNome { get; set; } = null!;

    public DateTime UsuarioEntrou { get; set; }

    public string Cargo { get; set; } = null!;

    public DateTime Regidh { get; set; }

    public int Regiusu { get; set; }

    public DateTime? Regadh { get; set; }

    public int? Regausu { get; set; }

    public virtual Conversa Conversa { get; set; } = null!;

    public virtual Usuario Usuario { get; set; } = null!;
}
