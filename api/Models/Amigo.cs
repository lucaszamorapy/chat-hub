using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Amigo
{
    public int AmigoId { get; set; }

    public int UsuarioId { get; set; }

    public int UsuarioAmigoId { get; set; }

    public string Status { get; set; } = null!;

    public DateTime Regidh { get; set; }

    public int Regiusu { get; set; }

    public DateTime? Regadh { get; set; }

    public int? Regausu { get; set; }
}
