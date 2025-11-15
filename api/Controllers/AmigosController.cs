using api.DTO;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Controllers
{
    [Authorize]
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
                return NotFound(new Message<List<Amigo>>("Ocorreu um erro ao obter o seu amigo", new List<Amigo>(), true, ReasonPhrases.GetReasonPhrase(StatusCodes.Status404NotFound)));
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
                    UsuarioId = amigo.UsuarioId, 
                    UsuarioAmigoId = amigo.UsuarioAmigoId, 
                    AmigoId = amigo.AmigoId,
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


            if (amigos == null)
            {
                return NotFound(new Message<List<Vwamigo>>("Ocorreu um erro ao obter o seu amigo", new List<Vwamigo>(), true, ReasonPhrases.GetReasonPhrase(StatusCodes.Status404NotFound)));
            }

            return Ok(new Message<List<Vwamigo>>("", amigosFiltrados, false));
        }


        // PUT: api/Amigos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAmigo(int id, Amigo amigo)
        {
            Vwamigo amigoView = new Vwamigo();
            var amigoBd = await _context.Amigos.Where(e => e.AmigoId == id).FirstOrDefaultAsync();
            amigoBd.Status = amigo.Status;

            if (id != amigo.AmigoId)
            {
                return BadRequest(new Message<List<Amigo>>("Ocorreu um erro ao alterar o seu amigo", new List<Amigo>(), true, ReasonPhrases.GetReasonPhrase(StatusCodes.Status400BadRequest)));
            }

            _context.Entry(amigoBd).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                amigoView = await _context.Vwamigos.Where(e => e.AmigoId == id).FirstOrDefaultAsync();

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
                return BadRequest(new Message<Amigo>("Ocorreu um erro ao adicionar o amigo", new Amigo { }, true, ex.Message));
            }
        }

        // DELETE: api/Amigos/5/4
        [HttpDelete("{id}/{usuarioAmigoId}")]
        public async Task<IActionResult> DeleteAmigo(int id, int usuarioAmigoId)
        {
            var amigo = await _context.Amigos.FindAsync(id);
            var usuarioId = TokenService.GetTokenUserId(HttpContext);
            if (amigo == null)
            {
                return NotFound(new Message<Amigo>("Ocorreu um erro ao excluir o seu amigo", new Amigo { }, true, ReasonPhrases.GetReasonPhrase(StatusCodes.Status404NotFound)));
            }

            _context.Amigos.Remove(amigo);

            var conversasDosDois = await _context.Vwconversausuarios
                .Where(e => e.Grupo == 0 &&
                       (e.UsuarioId == usuarioId || e.UsuarioId == usuarioAmigoId))
                .GroupBy(e => e.ConversaId)
                .Where(g =>
                    g.Any(x => x.UsuarioId == usuarioId) &&
                    g.Any(x => x.UsuarioId == usuarioAmigoId)
                )
                .Select(g => g.Key)
                .ToListAsync();

            if (conversasDosDois == null)
            {
                return NotFound(new Message<Conversa>("Ocorreu um erro ao excluir a conversa relacionada", new Conversa { }, true, ReasonPhrases.GetReasonPhrase(StatusCodes.Status404NotFound)));
            }

            var conversas = await _context.Conversas
                .Where(c => conversasDosDois.Contains(c.ConversaId))
                .ToListAsync();

            _context.Conversas.RemoveRange(conversas);
            await _context.SaveChangesAsync();

            return Ok(new Message<Amigo>("Amigo excluído com sucesso!", new Amigo { }, false));
        }

        private bool AmigoExists(int id)
        {
            return _context.Amigos.Any(e => e.AmigoId == id);
        }
    }
}
