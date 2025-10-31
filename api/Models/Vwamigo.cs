using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Vwamigo
{
    public int AmigoId { get; set; }

    public int UsuarioId { get; set; }

    public string Nome { get; set; } = null!;

    public string Apelido { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? PerfilFoto { get; set; }

    public string? StatusUsuario { get; set; }

    public string NomeAmigo { get; set; } = null!;

    public int UsuarioAmigoId { get; set; }

    public string ApelidoAmigo { get; set; } = null!;

    public string EmailAmigo { get; set; } = null!;

    public string? PerfilFotoAmigo { get; set; }

    public string? StatusAmigo { get; set; }

    public string Status { get; set; } = null!;

    public DateTime Regidh { get; set; }

    public int Regiusu { get; set; }

    public DateTime? Regadh { get; set; }

    public int? Regausu { get; set; }
}
