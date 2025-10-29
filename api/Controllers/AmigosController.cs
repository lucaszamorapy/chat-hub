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
    public class AmigosController : ControllerBase
    {
        private readonly ChatContext _context;

        public AmigosController(ChatContext context)
        {
            _context = context;
        }

        // GET: api/Amigos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Amigo>>> GetAmigos()
        {
            return await _context.Amigos.ToListAsync();
        }

        // GET: api/Amigos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Amigo>> GetAmigo(int id)
        {
            var amigo = await _context.Amigos.FindAsync(id);

            if (amigo == null)
            {
                return NotFound(new Message<List<Amigo>>("Ocorreu um erro ao obter o seu amigo", new List<Amigo>(), true));
            }

            return amigo;
        }

        // GET: api/Amigos/usuario/5
        [HttpGet("usuario/{id}")]
        public async Task<ActionResult<IEnumerable<Vwamigo>>> GetAmigoByUsuario(int id)
        {
            var amigos = await _context.Vwamigos.Where(e => e.UsuarioId == id).ToListAsync();

            if (amigos == null)
            {
                return NotFound(new Message<List<Vwamigo>>("Ocorreu um erro ao obter o seu amigo", new List<Vwamigo>(), true));
            }

            return amigos;
        }


        // PUT: api/Amigos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAmigo(int id, Amigo amigo)
        {
            if (id != amigo.AmigoId)
            {
                return BadRequest(new Message<List<Amigo>>("Ocorreu um erro ao alterar o seu amigo", new List<Amigo>(), true));
            }

            _context.Entry(amigo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AmigoExists(id))
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

        // POST: api/Amigos
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Amigo>> PostAmigo(Amigo amigo)
        {
            try
            {

                _context.Amigos.Add(amigo);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetAmigo", new { id = amigo.AmigoId }, amigo);
            }
            catch (Exception ex)
            {
                return BadRequest(new Message<Amigo>($"Ocorreu um erro ao adicionar o amigo: {ex.Message}", new Amigo { }, true));
            }
        }

        // DELETE: api/Amigos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAmigo(int id)
        {
            var amigo = await _context.Amigos.FindAsync(id);
            if (amigo == null)
            {
                return NotFound (new Message<Amigo>($"Ocorreu um erro ao exluir o seu amigo", new Amigo { }, true));
            }

            _context.Amigos.Remove(amigo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AmigoExists(int id)
        {
            return _context.Amigos.Any(e => e.AmigoId == id);
        }
    }
}
