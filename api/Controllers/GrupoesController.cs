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
    public class GrupoesController : ControllerBase
    {
        private readonly ChatContext _context;

        public GrupoesController(ChatContext context)
        {
            _context = context;
        }

        // GET: api/Grupoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Grupo>>> GetGrupos()
        {
            return await _context.Grupos.ToListAsync();
        }

        // GET: api/Grupoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Grupo>> GetGrupo(int id)
        {
            var grupo = await _context.Grupos.FindAsync(id);

            if (grupo == null)
            {
                return NotFound();
            }

            return grupo;
        }

        // PUT: api/Grupoes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGrupo(int id, GrupoesDTO grupo)
        {
            var grupoexiste = await _context.Grupos.Where(e => e.GrupoId == id).FirstOrDefaultAsync();

            if (grupoexiste == null)
            {
                return NotFound();
            }

            if (id != grupo.GrupoId)
            {
                return BadRequest();
            }

            grupoexiste.Cargo = grupo.Cargo;
            _context.Entry(grupoexiste).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GrupoExists(id))
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

        // POST: api/Grupoes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Grupo>> PostGrupo([FromBody] GrupoesDTO request)
        {
            foreach (var usuarioId in request.UsuariosIds)
            {
                var usuario = await _context.Usuarios.FindAsync(usuarioId);
                if (usuario == null)
                {
                    return NotFound($"Usuário com ID {usuarioId} não encontrado.");
                }
                var novogrupo = new Grupo
                {
                    ConversaId = request.ConversaId,
                    UsuarioId = usuarioId,
                    UsuarioEntrou = request.UsuarioEntrou,
                    Cargo = request.Cargo
                };

                _context.Grupos.Add(novogrupo);
                await _context.SaveChangesAsync();
            }
            return NoContent();
        }

        // DELETE: api/Grupoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGrupo(int id)
        {
            var grupo = await _context.Grupos.FindAsync(id);
            if (grupo == null)
            {
                return NotFound();
            }

            _context.Grupos.Remove(grupo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GrupoExists(int id)
        {
            return _context.Grupos.Any(e => e.GrupoId == id);
        }
    }
}
