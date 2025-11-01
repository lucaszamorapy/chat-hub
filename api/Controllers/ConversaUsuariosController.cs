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
        public async Task<ActionResult<IEnumerable<Vwconversausuario>>> GetConversaUsuarios()
        {
            try
            {
                var conversausuarios = await _context.Vwconversausuarios.ToListAsync();
                return Ok(new Message<List<Vwconversausuario>>("", conversausuarios, false));
            }
            catch
            {
                return BadRequest(new Message<List<Vwconversausuario>>("Ocorreu um erro ao obter a conversa com usuário", new List<Vwconversausuario>(), true));
            }
        }

        // GET: api/ConversaUsuarios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Vwconversausuario>> GetConversaUsuario(int id)
        {
            var conversausuario = await _context.Vwconversausuarios.FindAsync(id);

            if (conversausuario == null)
            {
                return BadRequest(new Message<Vwconversausuario>("Ocorreu um erro ao obter a conversa com usuário", new Vwconversausuario { }, true));
            }

            return Ok(new Message<Vwconversausuario>("", conversausuario, false));
        }

        // GET: api/ConversaUsuarios/usuario/5
        [HttpGet("usuario/{id}")]
        public async Task<ActionResult> GetConversasByUsuario(int id)
        {
            var conversasUsuario = await _context.Vwconversausuarios
                .AsNoTracking()
                .Where(e => e.UsuarioId == id)
                .ToListAsync();

            if (conversasUsuario == null || !conversasUsuario.Any())
            {
                return Ok(new Message<List<object>>("Nenhuma conversa encontrada", new List<object>(), false));

            }

            var resultado = new List<object>();

            foreach (var conversaUsuario in conversasUsuario)
            {
                var mensagens = await _context.Mensagens
                    .Where(m => m.ConversaId == conversaUsuario.ConversaId)
                    .OrderByDescending(m => m.Regidh)
                    .ToListAsync();

                var usuarioId = TokenService.GetTokenUserId(HttpContext);
                Usuario outroUsuario = new Usuario();

                if (conversaUsuario.Grupo == 0) 
                {
                    outroUsuario = await _context.Usuarios
                        .Where(u => _context.Vwconversausuarios
                            .Where(cu => cu.ConversaId == conversaUsuario.ConversaId && cu.UsuarioId != usuarioId)
                            .Select(cu => cu.UsuarioId)
                            .Contains(u.UsuarioId)) //se existe no IN ele faz o first or default
                        .FirstOrDefaultAsync();
                }


                resultado.Add(new
                {
                    conversaUsuario.ConversaId,
                    conversaUsuario.UsuarioId,
                    ConversaNome = conversaUsuario.Grupo == 1 ? conversaUsuario.ConversaNome : outroUsuario.Nome,
                    conversaUsuario.ConversaFoto,
                    conversaUsuario.Grupo,
                    Mensagens = mensagens,
                    conversaUsuario.Regidh,
                    conversaUsuario.Regiusu,
                    conversaUsuario.Regadh,
                    conversaUsuario.Regausu
                });
            }

            return Ok(new Message<List<object>>("", resultado, false));
        }


        // PUT: api/ConversaUsuarios/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGrupo(int id, ConversaUsuario conversausuario)
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

            return Ok(new Message<ConversaUsuario>("Conversa usuário atualizado com sucesso!.", conversausuarioexiste, true));
        }

        // POST: api/ConversaUsuarios
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPost]
        //public async Task<ActionResult<ConversaUsuario>> PostConversaUsuario([FromBody] ConversaUsuarioDTO request)
        //{
        //    foreach (var usuarioId in request.UsuariosIds)
        //    {
        //        var usuario = await _context.Usuarios.FindAsync(usuarioId);
        //        if (usuario == null)
        //        {
        //            return BadRequest(new Message<ConversaUsuario>($"Usuário com ID {usuarioId} não encontrado.", new ConversaUsuario { }, true));
        //        }
        //        var novo = new ConversaUsuario
        //        {
        //            ConversaId = request.ConversaId,
        //            UsuarioId = usuarioId,
        //            UsuarioEntrou = request.UsuarioEntrou,
        //            Cargo = request.Cargo
        //        };

        //        _context.ConversaUsuarios.Add(novo);
        //        await _context.SaveChangesAsync();
        //    }
        //    return NoContent();
        //}

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

            return Ok(new Message<ConversaUsuario>("Conversa usuário excluído com sucesso!", new ConversaUsuario { }, false));
        }

        private bool ConversaUsuariosExists(int id)
        {
            return _context.ConversaUsuarios.Any(e => e.ConversaUsuariosId == id);
        }
    }
}
