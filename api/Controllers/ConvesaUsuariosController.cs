using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using api.DTO;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConvesaUsuariosController : ControllerBase
    {
        private readonly ChatContext _context;

        public ConvesaUsuariosController(ChatContext context)
        {
            _context = context;
        }

        // GET: api/ConversaUsuarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ConversaUsuario>>> GetConversaUsuarios()
        {
            return await _context.ConversaUsuarios.ToListAsync();
        }

        // GET: api/ConversaUsuarios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ConversaUsuario>> GetConversaUsuario(int id)
        {
            var conversausuario = await _context.ConversaUsuarios.FindAsync(id);

            if (conversausuario == null)
            {
                return NotFound();
            }

            return conversausuario;
        }

        // PUT: api/ConversaUsuarios/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGrupo(int id, ConversaUsuarioDTO conversausuario)
        {
            var conversausuarioexiste = await _context.ConversaUsuarios.Where(e => e.ConversaUsuariosId == id).FirstOrDefaultAsync();

            if (conversausuarioexiste == null)
            {
                return NotFound();
            }

            if (id != conversausuario.ConversaUsuariosId)
            {
                return BadRequest();
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
                    return NotFound($"Usuário com ID {usuarioId} não encontrado.");
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
                return NotFound();
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
