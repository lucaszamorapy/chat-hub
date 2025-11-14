using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Vwmensagen
{
    public int MensagemId { get; set; }

    public int ConversaId { get; set; }

    public string Mensagem { get; set; } = null!;

    public DateTime? Visualizada { get; set; }

    public int UsuarioId { get; set; }

    public string UsuarioNome { get; set; } = null!;

    public string UsuarioApelido { get; set; } = null!;

    public DateTime Regidh { get; set; }

    public int Regiusu { get; set; }

    public DateTime? Regadh { get; set; }

    public int? Regausu { get; set; }
}
