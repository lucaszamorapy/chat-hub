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
            var amigos = await _context.Amigos.ToListAsync();
            return Ok(new Message<List<Amigo>>("", amigos, false));
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

            return Ok(new Message<Amigo>("", amigo, false));
        }

        // GET: api/Amigos/usuario/5
        [HttpGet("usuario/{id}")]
        public async Task<ActionResult<IEnumerable<Vwamigo>>> GetAmigoByUsuario(int id)
        {
            var amigos = await _context.Vwamigos.Where(e => e.UsuarioId == id || e.UsuarioAmigoId == id).ToListAsync();
            var usuario = await _context.Usuarios.FindAsync(id);

            List<Vwamigo> amigosFiltrados = new List<Vwamigo>();

            foreach (var amigo in amigos)
            {
                bool usuarioEhUsuarioId = amigo.UsuarioId == id;

                var amigoFiltrado = new Vwamigo
                {
                    UsuarioId = id, 
                    UsuarioAmigoId = usuarioEhUsuarioId ? amigo.UsuarioAmigoId : amigo.UsuarioId, 
                    AmigoId = usuarioEhUsuarioId ? amigo.UsuarioAmigoId : amigo.UsuarioId,
                    NomeAmigo = usuarioEhUsuarioId ? amigo.NomeAmigo : amigo.Nome,
                    ApelidoAmigo = usuarioEhUsuarioId ? amigo.ApelidoAmigo : amigo.Apelido,
                    EmailAmigo = usuarioEhUsuarioId ? amigo.EmailAmigo : amigo.Email,
                    PerfilFotoAmigo = usuarioEhUsuarioId ? amigo.PerfilFotoAmigo : amigo.PerfilFoto,
                    Status = amigo.Status,
                    StatusAmigo = usuarioEhUsuarioId ? amigo.StatusAmigo : amigo.StatusUsuario,
                    Regidh = amigo.Regidh,
                    Regiusu = amigo.Regiusu,
                    Regadh = amigo.Regadh,
                    Regausu = amigo.Regausu
                };

                amigosFiltrados.Add(amigoFiltrado);
            }


            var resultado = amigosFiltrados
                   .Where(a => a.UsuarioAmigoId != id)
                   .ToList();

            if (amigos == null)
            {
                return NotFound(new Message<List<Vwamigo>>("Ocorreu um erro ao obter o seu amigo", new List<Vwamigo>(), true));
            }

            return Ok(new Message<List<Vwamigo>>("", resultado, false));
        }


        // PUT: api/Amigos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAmigo(int id, Amigo amigo)
        {
            Vwamigo amigoView = new Vwamigo();

            if (id != amigo.AmigoId)
            {
                return BadRequest(new Message<List<Amigo>>("Ocorreu um erro ao alterar o seu amigo", new List<Amigo>(), true));
            }

            _context.Entry(amigo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                amigoView = await _context.Vwamigos.Where(e => e.AmigoId == amigo.AmigoId).FirstOrDefaultAsync();

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

            return Ok(new Message<Vwamigo>("Pedido de amizade aceito com sucesso!.", amigoView, false));
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
                CreatedAtAction("GetAmigo", new { id = amigo.AmigoId }, amigo);
                return Ok(new Message<Amigo>("Pedido de amigo enviado com sucesso!", amigo, false));
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
                return NotFound(new Message<Amigo>("Ocorreu um erro ao excluir o seu amigo", new Amigo { }, true));
            }

            _context.Amigos.Remove(amigo);
            await _context.SaveChangesAsync();

            return Ok(new Message<Amigo>("Amigo excluído com sucesso!", new Amigo { }, false));
        }

        private bool AmigoExists(int id)
        {
            return _context.Amigos.Any(e => e.AmigoId == id);
        }
    }
}
