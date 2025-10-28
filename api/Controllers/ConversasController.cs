using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Services;
using api.Models;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConversasController : ControllerBase
    {
        private readonly ChatContext _context;

        public ConversasController(ChatContext context)
        {
            _context = context;
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

                return Ok(conversas);
            }
            catch
            {
                return BadRequest(new Message<List<Conversa>>("Ocorreu um erro ao obter a listagem de conversas", new List<Conversa>(), true));
            }
        }

        // GET: api/Conversas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetConversa(int id)
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

            return Ok(conversa);
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
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(new Message<Conversa>("Conversa alterada com sucesso!", conversa, false));
        }

        // POST: api/Conversas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Conversa>> PostConversa(Conversa conversa)
        {
            try
            {
                _context.Conversas.Add(conversa);
                await _context.SaveChangesAsync();

                CreatedAtAction("GetConversa", new { id = conversa.ConversaId }, conversa);

                return Ok(new Message<Conversa>("Conversa criada com sucesso!", conversa, false));
            }
            catch
            {
                return BadRequest(new Message<Conversa>("Ocorreu um erro tentar criar uma conversa", new Conversa { }, true));
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
