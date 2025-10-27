using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Conversa
{
    public int ConversaId { get; set; }

    public string ConversaNome { get; set; } = null!;

    public string? ConversaFoto { get; set; }

    public sbyte Grupo { get; set; }

    public DateTime Regidh { get; set; }

    public int Regiusu { get; set; }

    public DateTime? Regadh { get; set; }

    public int? Regausu { get; set; }

    public virtual ICollection<ConversaUsuario> ConversaUsuarios { get; set; } = new List<ConversaUsuario>();

    public virtual ICollection<Mensagen> Mensagens { get; set; } = new List<Mensagen>();
}
