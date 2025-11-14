using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Vwconversausuario
{
    public int ConversaUsuariosId { get; set; }

    public int ConversaId { get; set; }

    public int? UsuarioId { get; set; }

    public string? UsuarioNome { get; set; }

    public string? UsuarioApelido { get; set; }

    public string? UsuarioPerfilFoto { get; set; }

    public DateTime UsuarioEntrou { get; set; }

    public string Cargo { get; set; } = null!;

    public string ConversaNome { get; set; } = null!;

    public string? ConversaFoto { get; set; }

    public sbyte? Grupo { get; set; }

    public DateTime Regidh { get; set; }

    public int Regiusu { get; set; }

    public DateTime? Regadh { get; set; }

    public int? Regausu { get; set; }
}
