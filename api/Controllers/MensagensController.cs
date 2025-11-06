using api.DTO;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.WebUtilities;
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
                var mensagens = await _context.Mensagens.ToListAsync();
                return Ok(new Message<List<Mensagen>>("", mensagens, false));
            }
            catch
            {
                return BadRequest(new Message<List<Mensagen>>("Ocorreu um erro ao obter a listagem de mensagens", new List<Mensagen>(), true, ReasonPhrases.GetReasonPhrase(StatusCodes.Status400BadRequest)));
            }
        }

        // GET: api/Mensagens/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Mensagen>> GetMensagen(int id)
        {
            var mensagem = await _context.Mensagens.FindAsync(id);

            if (mensagem == null)
            {
                return NotFound(new Message<Mensagen>("Ocorreu um erro ao obter a mensagem", new Mensagen { }, true, ReasonPhrases.GetReasonPhrase(StatusCodes.Status404NotFound)));
            }

            return Ok(new Message<Mensagen>("", mensagem, false));
        }

        // PUT: api/Mensagens/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMensagen(int id, Mensagen mensagem)
        {
            if (id != mensagem.MensagemId)
            {
                return BadRequest(new Message<Mensagen>("Mensagem não encontrada.", new Mensagen { }, true, ReasonPhrases.GetReasonPhrase(StatusCodes.Status400BadRequest)));
            }

            _context.Entry(mensagem).State = EntityState.Modified;

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

            return Ok(new Message<Mensagen>("Mensagem atualizada com sucesso!", mensagem, false));
        }

        // POST: api/Mensagens
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("visualizar")]
        public async Task<ActionResult<Mensagen>> PostVisualizarMensagem(List<MensagenDTO> mensagens)
        {

            foreach (var msg in mensagens)
            {
                try
                {

                    var mensagem = await _context.Mensagens.FindAsync(msg.MensagemId);
                    if (mensagem != null)
                    {
                        mensagem.Visualizada = DateTime.Now;
                        _context.Entry(mensagem).State = EntityState.Modified;
                    }
                }
                catch
                {
                    return BadRequest(new Message<Mensagen>("Ocorreu um erro ao marcar a mensagem como visualizada.", new Mensagen { }, true, ReasonPhrases.GetReasonPhrase(StatusCodes.Status400BadRequest)));
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new Message<Mensagen>("Mensagem marcada como visualizada.", new Mensagen { }, false));

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
                return BadRequest(new Message<Mensagen>("Ocorreu um erro ao enviar mensagem.", new Mensagen { }, true, ReasonPhrases.GetReasonPhrase(StatusCodes.Status400BadRequest)));
            }
        }

        // DELETE: api/Mensagens/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMensagen(int id)
        {
            var mensagem = await _context.Mensagens.FindAsync(id);
            if (mensagem == null)
            {
                return NotFound(new Message<Mensagen>("Mensagem não encontrada.", new Mensagen { }, true, ReasonPhrases.GetReasonPhrase(StatusCodes.Status404NotFound)));
            }

            _context.Mensagens.Remove(mensagem);
            await _context.SaveChangesAsync();

            return Ok(new Message<Mensagen>("Mensagem excluído com sucesso!", new Mensagen { }, false));
        }

        private bool MensagenExists(int id)
        {
            return _context.Mensagens.Any(e => e.MensagemId == id);
        }
    }
}
