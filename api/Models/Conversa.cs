using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Conversa
{
    public int ConversaId { get; set; }

    public string NomeConversa { get; set; } = null!;

    public sbyte Grupo { get; set; }

    public DateTime Regidh { get; set; }

    public int Regiusu { get; set; }

    public DateTime? Regadh { get; set; }

    public int? Regausu { get; set; }

    public virtual ICollection<Grupo> Grupos { get; set; } = new List<Grupo>();

    public virtual ICollection<Mensagen> Mensagens { get; set; } = new List<Mensagen>();
}
