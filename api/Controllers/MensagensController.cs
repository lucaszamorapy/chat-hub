using api.DTO;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MensagensController : ControllerBase
    {
        private readonly ChatContext _context;
        private readonly IHubContext<ChatHub> _hubContext;

        public MensagensController(ChatContext context, IHubContext<ChatHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        // GET: api/Mensagens
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Mensagen>>> GetMensagens()
        {
            try
            {
                return await _context.Mensagens.ToListAsync();
            }
            catch
            {
                return BadRequest(new Message<List<Mensagen>>("Ocorreu um erro ao obter a listagem de mensagens", new List<Mensagen>(), true));
            }
        }

        // GET: api/Mensagens/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Mensagen>> GetMensagen(int id)
        {
            var mensagen = await _context.Mensagens.FindAsync(id);

            if (mensagen == null)
            {
                return BadRequest(new Message<Mensagen>("Ocorreu um erro ao obter a mensagem", new Mensagen { }, true));
            }

            return mensagen;
        }

        // PUT: api/Mensagens/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMensagen(int id, Mensagen mensagen)
        {
            if (id != mensagen.MensagemId)
            {
                return BadRequest(new Message<Mensagen>("Mensagem não encontrada.", new Mensagen { }, true));
            }

            _context.Entry(mensagen).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MensagenExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Mensagens
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Mensagen>> PostMensagen(MensagenDTO mensagemDto)
        {
            try
            {

                var mensagem = new Mensagen
                {
                    Mensagem = mensagemDto.Mensagem,
                    ConversaId = mensagemDto.ConversaId,
                    UsuarioId = mensagemDto.UsuarioId
                };
                _context.Mensagens.Add(mensagem);
                await _context.SaveChangesAsync();

                var usuarioId = TokenService.GetTokenUserId(HttpContext);
                var usuario = await _context.Usuarios.FindAsync(usuarioId);

                if (usuario != null)
                {
                    await _hubContext.Clients.All.SendAsync("ReceiveMessage", usuario.Nome, mensagem.Mensagem);
                }

                return CreatedAtAction("GetMensagen", new { id = mensagem.MensagemId }, mensagemDto);
            }
            catch
            {
                return BadRequest(new Message<Mensagen>("Ocorreu um erro ao enviar mensagem.", new Mensagen { }, true));
            }
        }

        // DELETE: api/Mensagens/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMensagen(int id)
        {
            var mensagen = await _context.Mensagens.FindAsync(id);
            if (mensagen == null)
            {
                return BadRequest(new Message<Mensagen>("Mensagem não encontrada.", new Mensagen { }, true));
            }

            _context.Mensagens.Remove(mensagen);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MensagenExists(int id)
        {
            return _context.Mensagens.Any(e => e.MensagemId == id);
        }
    }
}
