using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Vwconversausuario
{
    public int ConversaId { get; set; }

    public int UsuarioId { get; set; }

    public DateTime UsuarioEntrou { get; set; }

    public string Cargo { get; set; } = null!;

    public string? ConversaNome { get; set; }

    public string? ConversaFoto { get; set; }

    public sbyte? Grupo { get; set; }

    public DateTime Regidh { get; set; }

    public int Regiusu { get; set; }

    public DateTime? Regadh { get; set; }

    public int? Regausu { get; set; }
}
