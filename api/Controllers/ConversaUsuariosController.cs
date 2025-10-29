using api.DTO;
using api.Models;
using api.Services;
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
    public class ConversaUsuariosController : ControllerBase
    {
        private readonly ChatContext _context;

        public ConversaUsuariosController(ChatContext context)
        {
            _context = context;
        }

        // GET: api/ConversaUsuarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ConversaUsuario>>> GetConversaUsuarios()
        {

            try
            {
                return await _context.ConversaUsuarios.ToListAsync();
            }
            catch
            {
                return BadRequest(new Message<List<ConversaUsuario>>("Ocorreu um erro ao obter a listagem de conversas com usuários", new List<ConversaUsuario>(), true));
            }
        }

        // GET: api/ConversaUsuarios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ConversaUsuario>> GetConversaUsuario(int id)
        {
            var conversausuario = await _context.ConversaUsuarios.FindAsync(id);

            if (conversausuario == null)
            {
                return BadRequest(new Message<ConversaUsuario>("Ocorreu um erro ao obter a conversa com usuário", new ConversaUsuario { }, true));
            }

            return conversausuario;
        }

        // GET: api/ConversaUsuarios/usuario/5
        [HttpGet("usuario/{id}")]
        public async Task<ActionResult<object>> GetConversaByUsuario(int id)
        {
            var conversaUsuario = await _context.Vwconversausuarios
                     .AsNoTracking()
                     .Where(e => e.UsuarioId == id)
                     .FirstOrDefaultAsync();

            if (conversaUsuario == null)
                return null;

            var mensagens = await _context.Mensagens
                .Where(m => m.ConversaId == conversaUsuario.ConversaId)
                .OrderByDescending(m => m.Regidh)
                .ToListAsync();

            var resultado = new
            {
                conversaUsuario.ConversaId,
                conversaUsuario.UsuarioId,
                conversaUsuario.ConversaNome,
                conversaUsuario.ConversaFoto,
                conversaUsuario.Grupo,
                Mensagens = mensagens,
                conversaUsuario.Regidh,
                conversaUsuario.Regiusu,
                conversaUsuario.Regadh,
                conversaUsuario.Regausu
            };


            if (resultado == null)
            {
                return BadRequest(new Message<Vwconversausuario>("Ocorreu um erro ao obter a conversa com usuário", new Vwconversausuario { }, true));
            }

            return conversaUsuario;
        }

        // PUT: api/ConversaUsuarios/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGrupo(int id, ConversaUsuarioDTO conversausuario)
        {
            var conversausuarioexiste = await _context.ConversaUsuarios.Where(e => e.ConversaUsuariosId == id).FirstOrDefaultAsync();

            if (conversausuarioexiste == null)
            {
                return BadRequest(new Message<ConversaUsuario>("Conversa usuário não existe.", new ConversaUsuario { }, true));
            }

            conversausuarioexiste.Cargo = conversausuario.Cargo;
            _context.Entry(conversausuarioexiste).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ConversaUsuariosExists(id))
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

        // POST: api/ConversaUsuarios
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ConversaUsuario>> PostConversaUsuario([FromBody] ConversaUsuarioDTO request)
        {
            foreach (var usuarioId in request.UsuariosIds)
            {
                var usuario = await _context.Usuarios.FindAsync(usuarioId);
                if (usuario == null)
                {
                    return BadRequest(new Message<ConversaUsuario>($"Usuário com ID {usuarioId} não encontrado.", new ConversaUsuario { }, true));
                }
                var novo = new ConversaUsuario
                {
                    ConversaId = request.ConversaId,
                    UsuarioId = usuarioId,
                    UsuarioEntrou = request.UsuarioEntrou,
                    Cargo = request.Cargo
                };

                _context.ConversaUsuarios.Add(novo);
                await _context.SaveChangesAsync();
            }
            return NoContent();
        }

        // DELETE: api/ConversaUsuarios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConversaUsuario(int id)
        {
            var conversausuario = await _context.ConversaUsuarios.FindAsync(id);
            if (conversausuario == null)
            {
                return BadRequest(new Message<ConversaUsuario>("Conversa usuário não encontrado.", new ConversaUsuario { }, true));
            }

            _context.ConversaUsuarios.Remove(conversausuario);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ConversaUsuariosExists(int id)
        {
            return _context.ConversaUsuarios.Any(e => e.ConversaUsuariosId == id);
        }
    }
}
