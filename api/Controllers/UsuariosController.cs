using api.DTO;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Configuration;
using PGMTApi.Services;
using System.Configuration;


namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly ChatContext _context;
        private readonly IConfiguration _configuration;

        public UsuariosController(ChatContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // GET: api/Usuarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
        {
            return await _context.Usuarios.ToListAsync();
        }

        // GET: api/Usuarios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
            {
                return NotFound();
            }

            return usuario;
        }

        // PUT: api/Usuarios/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuario(int id, Usuario usuario)
        {
            if (id != usuario.UsuarioId)
            {
                return BadRequest();
            }

            _context.Entry(usuario).State = EntityState.Modified;

            var existenome = _context.Usuarios.Any(u => u.Nome == usuario.Nome && u.UsuarioId != usuario.UsuarioId);

            if (existenome)
            {
                return Problem("Nome já cadastradado no sistema");
            }

            usuario.Senha = BCrypt.Net.BCrypt.HashPassword(usuario.Senha);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsuarioExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return Ok(new Message<Usuario>("Usuário alterado com sucesso.", usuario));
        }

        // POST: api/Usuarios
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Usuario>> PostUsuario( Usuario usuario)
        {
            var existenome = _context.Usuarios.Any(u => u.Nome == usuario.Nome && u.UsuarioId != usuario.UsuarioId);
            if (existenome)
            {
                return Problem("Nome já cadastradado no sistema");
            }

            usuario.Senha = BCrypt.Net.BCrypt.HashPassword(usuario.Senha);

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            CreatedAtAction("GetUsuario", new { id = usuario.UsuarioId }, usuario);
            usuario.Senha = "";
            return Ok(new Message<Usuario>("Usuário criado com sucesso.", usuario));
        }

        // POST: api/Usuarios/login
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost("login")]
        public async Task<ActionResult<Usuario>> PostUsuarioLogin(UsuarioDTO usuario)
        {
            var existeusuario = await _context.Usuarios.Where(u => u.Nome == usuario.Nome).FirstOrDefaultAsync();

            if (existeusuario == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            if (usuario.Senha == null || !BCrypt.Net.BCrypt.Verify(usuario.Senha, existeusuario.Senha))
            {
                return Problem("Senha inválida.");
            }

            var token = TokenService.GenerateToken(existeusuario);
            usuario.Senha = "";
            return Ok(new Message<object>($"Bem-vindo, {usuario.Nome}!", new
            {
                usuario = existeusuario,
                token = token
            }));

        }

        // DELETE: api/Usuarios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return Ok(new Message<object>("Usuário excluído com sucesso.", new { }));
        }

        private bool UsuarioExists(int id)
        {
            return _context.Usuarios.Any(e => e.UsuarioId == id);
        }
    }
}
