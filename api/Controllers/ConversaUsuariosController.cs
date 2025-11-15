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
                return BadRequest(new Message<List<Vwconversausuario>>("Ocorreu um erro ao obter a conversa com usuário", new List<Vwconversausuario>(), true, ReasonPhrases.GetReasonPhrase(StatusCodes.Status400BadRequest)));
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Vwconversausuario>> GetConversa(int id)
        {
            var usuarioId = TokenService.GetTokenUserId(HttpContext);
            List<Vwconversausuario> resultado = new List<Vwconversausuario>();
            var conversa = await _context.Conversas.Where(e => e.ConversaId == id).FirstOrDefaultAsync();

            if (conversa.Grupo == 1)
            {
                resultado = await _context.Vwconversausuarios
                    .Where(v => v.ConversaId == id)
                    .ToListAsync();
            }
            else
            {
                resultado = await _context.Vwconversausuarios
                    .Where(v => v.ConversaId == id && v.UsuarioId == usuarioId)
                    .ToListAsync();
            }

            var retorno = new
            {
                ConversaId = resultado.First().ConversaId,
                Grupo = resultado.First().Grupo,
                ConversaUsuarios = resultado.Select(v => new
                {
                    v.ConversaUsuariosId,
                    v.Cargo,
                    v.ConversaNome,
                    v.ConversaFoto,
                    v.UsuarioId,
                    v.UsuarioNome,
                    v.UsuarioApelido,
                    v.UsuarioPerfilFoto,
                }),
                Mensagens = await _context.Vwmensagens
                    .Where(m => m.ConversaId == id)
                    .Select(m => new
                    {
                        m.MensagemId,
                        m.Mensagem,
                        m.UsuarioId,
                        m.UsuarioNome,
                        m.Visualizada,
                        m.Regidh
                    })
                    .ToListAsync()
            };

            return Ok(new Message<object>("", retorno, false));
        }



        // GET: api/ConversaUsuarios/usuario/5
        [HttpGet("usuario/{id}")]
        public async Task<ActionResult> GetConversasByUsuario(int id)
        {
            var conversasUsuario = await _context.Vwconversausuarios
                .AsNoTracking()
                .Where(e => e.UsuarioId == id).Distinct()
                .ToListAsync();

            if (conversasUsuario == null || !conversasUsuario.Any())
            {
                return BadRequest(new Message<List<object>>("Nenhuma conversa encontrada", new List<object>(), false, ReasonPhrases.GetReasonPhrase(StatusCodes.Status400BadRequest)));

            }

            var resultado = new List<object>();

            foreach (var conversaUsuario in conversasUsuario)
            {
                var mensagens = await _context.Mensagens
                    .Where(m => m.ConversaId == conversaUsuario.ConversaId)
                    .OrderByDescending(m => m.Regidh)
                    .ToListAsync();

                resultado.Add(new
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
                return BadRequest(new Message<ConversaUsuario>("Conversa usuário não existe.", new ConversaUsuario { }, true, ReasonPhrases.GetReasonPhrase(StatusCodes.Status400BadRequest)));
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

            return Ok(new Message<ConversaUsuario>("Conversa usuário atualizado com sucesso!.", conversausuarioexiste, false));
        }




        //POST: api/ConversaUsuarios
        //To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
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
                return BadRequest(new Message<ConversaUsuario>("Conversa usuário não encontrado.", new ConversaUsuario { }, true, ReasonPhrases.GetReasonPhrase(StatusCodes.Status400BadRequest)));
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
