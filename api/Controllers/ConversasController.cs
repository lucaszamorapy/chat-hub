using api.DTO;
using api.Models;
using api.Services;
using Humanizer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConversasController : ControllerBase
    {
        private readonly ChatContext _context;
        private readonly IConfiguration _configuration;

        public ConversasController(ChatContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // GET: api/Conversas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Conversa>>> GetConversas()
        {
            try
            {

                var conversas = await _context.Conversas
                    .Include(e => e.Mensagens)
                    .ToListAsync();

                return Ok(new Message<List<Conversa>>("", conversas, false));
            }
            catch
            {
                return BadRequest(new Message<List<Conversa>>("Ocorreu um erro ao obter a listagem de conversas", new List<Conversa>(), true));
            }
        }

        // GET: api/Conversas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Conversa>> GetConversa(int id)
        {
            var conversa = await _context.Conversas
                .Where(c => c.ConversaId == id)
                .Select(c => new
                {
                    c.ConversaId,
                    c.ConversaNome,
                    ConversaUsuarios = c.ConversaUsuarios.Select(g => new
                    {
                        g.ConversaUsuariosId,
                        g.Cargo,
                        Usuario = new
                        {
                            g.Usuario.UsuarioId,
                            g.Usuario.Nome
                        }
                    }).ToList(),
                    Mensagens = c.Mensagens.Select(m => new
                    {
                        m.MensagemId,
                        m.Mensagem,
                        Usuario = new
                        {
                            m.Usuario.UsuarioId,
                            m.Usuario.Nome,
                        }
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (conversa == null)
            {
                return BadRequest(new Message<Conversa>("Conversa não encontrada.", new Conversa { }, true));
            }

            return Ok(new Message<object>("", conversa, false));
        }


        // PUT: api/Conversas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutConversa(int id, Conversa conversa)
        {
            if (id != conversa.ConversaId)
            {
                return BadRequest(new Message<Conversa>("Conversa não encontrada.", new Conversa { }, true));
            }

            _context.Entry(conversa).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ConversaExists(id))
                {
                    return NotFound((new Message<Conversa>("Conversa não encontrada.", new Conversa { }, true)));
                }
                else
                {
                    throw;
                }
            }

            return Ok(new Message<Conversa>("Conversa alterada com sucesso!", conversa, false));
        }

        [HttpPost]
        public async Task<ActionResult<Conversa>> PostConversa([FromForm] ConversaDTO conversaDto)
        {
            sbyte grupo = 0;

            if (int.TryParse(conversaDto.Grupo.ToString(), out int numero))
            {
                grupo = (sbyte)numero;
            }
            else if (bool.TryParse(conversaDto.Grupo.ToString(), out bool boolValor))
            {
                grupo = (sbyte)(boolValor ? 1 : 0);
            }

            var usuarioIds = conversaDto.ConversaUsuarios.Select(u => u.UsuarioId).ToList();

            var conversaExiste = await _context.Vwconversausuarios
                .Where(e => e.ConversaNome == conversaDto.ConversaNome && usuarioIds.Contains(e.UsuarioId))
                .FirstOrDefaultAsync();

            if (conversaExiste != null)
            {
                return Ok(new Message<Vwconversausuario>(null, conversaExiste, false));
            }

            await using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var nova = new Conversa
                {
                    ConversaNome = conversaDto.ConversaNome,
                    Grupo = grupo
                };

                _context.Conversas.Add(nova);
                await _context.SaveChangesAsync();

                var geralService = new GeralService(_configuration);

                var caminhoConversa = Path.Combine("conversas", $"conversa_{nova.ConversaId}", "perfil");
                geralService.CriarPasta(new List<string> { caminhoConversa });

                if (grupo == 0)
                {
                    foreach (var usuario in conversaDto.ConversaUsuarios)
                    {
                        var usuarioDb = await _context.Usuarios.FindAsync(usuario.UsuarioId);

                        if (usuarioDb != null)
                        {
                            if (!string.IsNullOrEmpty(usuarioDb.PerfilFoto))
                            {
                                var origem = Path.Combine(_configuration["caminhoPasta"], "usuarios", $"usuario_{usuario.UsuarioId}", "perfil", usuarioDb.PerfilFoto); //caminho absoluto!!
                                var destino = Path.Combine(_configuration["caminhoPasta"], caminhoConversa, usuarioDb.PerfilFoto); //caminho absoluto!!

                                if (System.IO.File.Exists(origem))
                                {
                                    System.IO.File.Copy(origem, destino, overwrite: true);
                                    nova.ConversaFoto = usuarioDb.PerfilFoto;
                                    break;
                                }
                            }
                        }
                    }
                }

                if (conversaDto.ConversaFoto != null)
                {
                    var caminhoArquivo = await geralService.SalvarArquivo(
                        conversaDto.ConversaFoto,
                        caminhoConversa
                    );

                    nova.ConversaFoto = Path.GetFileName(caminhoArquivo);
                }

                await _context.SaveChangesAsync();

                var usuariosParaAdicionar = conversaDto.ConversaUsuarios.Select(u => new ConversaUsuario
                {
                    ConversaId = nova.ConversaId,
                    UsuarioId = u.UsuarioId,
                    Cargo = u.Cargo,
                    UsuarioEntrou = DateTime.Now
                }).ToList();

                _context.ConversaUsuarios.AddRange(usuariosParaAdicionar);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new Message<Conversa>("Conversa criada com sucesso!", nova, false));
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();

                return BadRequest(new Message<Conversa>(
                    $"Erro ao criar conversa: {ex.Message}",
                    new Conversa(),
                    true
                ));
            }
        }


        // DELETE: api/Conversas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConversa(int id)
        {
            var conversa = await _context.Conversas.FindAsync(id);
            if (conversa == null)
            {
                return BadRequest(new Message<Conversa>("Conversa não encontrada", new Conversa { }, true));
            }

            _context.Conversas.Remove(conversa);
            await _context.SaveChangesAsync();

            return Ok(new Message<object>("Conversa excluída com sucesso!", new Conversa { }, false));
        }

        private bool ConversaExists(int id)
        {
            return _context.Conversas.Any(e => e.ConversaId == id);
        }
    }
}
