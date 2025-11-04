using api.DTO;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using NuGet.Configuration;
using System;
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
            try
            {
                var usuarios = await _context.Usuarios.ToListAsync();
                return Ok(new Message<List<Usuario>>("", usuarios, false));
            }
            catch
            {
                return BadRequest(new Message<List<Usuario>>("Ocorreu um erro ao obter a listagem de usuários", new List<Usuario>(), true));
            }
        }

        // GET: api/Usuarios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
            {
                return BadRequest(new Message<Usuario>("Ocorreu um erro ao obter o usuário.", new Usuario { }, true));
            }

            return Ok(new Message<Usuario>("", usuario, false));
        }

        // PUT: api/Usuarios/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuario(int id, Usuario usuario)
        {
            if (id != usuario.UsuarioId)
            {
                return BadRequest(new Message<Usuario>("ID do usuário não foi encontrado.", new Usuario { }, true));
            }

            _context.Entry(usuario).State = EntityState.Modified;

            var existeapelido = _context.Usuarios.Any(u => u.Apelido == usuario.Apelido && u.UsuarioId != usuario.UsuarioId);

            if (existeapelido)
            {
                return BadRequest(new Message<Usuario>("Apelido já cadastrado no sistema.", new Usuario { }, true));
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
                    return BadRequest(new Message<Usuario>("Usuário não existe no sistema.", new Usuario { }, true));
                }
                else
                {
                    throw;
                }
            }
            return Ok(new Message<Usuario>("Usuário alterado com sucesso.", usuario, false));
        }

        // POST: api/Usuarios/filtro
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("filtro")]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarioWithFilter(JObject filtro)
        {
            if (filtro == null || filtro.Properties().All(p => string.IsNullOrEmpty(p.Value?.ToString())))
            {
                return Ok(new List<Usuario>());
            }

            string apelido = filtro["apelido"]?.ToString() ?? "";

            var usuarios = await _context.Usuarios
                    .Where(e =>
                        ((string.IsNullOrEmpty(apelido) || e.Nome.Contains(apelido)) || (string.IsNullOrEmpty(apelido) || e.Apelido.Contains(apelido))))
                        .Take(2000)
                        .ToListAsync();
            return Ok(usuarios);
        }

        // POST: api/Usuarios
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Usuario>> PostUsuario([FromForm] UsuarioDTO usuarioDto)
        {
            var existeNome = _context.Usuarios.Any(u => u.Apelido == usuarioDto.Apelido);
            if (existeNome)
            {
                return BadRequest(new Message<object>("Apelido já cadastrado no sistema.", new { }, true));
            }

            var senhaCriptografada = BCrypt.Net.BCrypt.HashPassword(usuarioDto.Senha);

            var usuario = new Usuario
            {
                Nome = usuarioDto.Nome,
                Apelido = usuarioDto.Apelido,
                Senha = senhaCriptografada,
                Email = usuarioDto.Email,
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            var caminho = Path.Combine("usuarios", $"usuario_{usuario.UsuarioId}", "perfil");
            List<string> caminhoLista = new List<string> { caminho };

            var geralService = new GeralService(_configuration);
            geralService.CriarPasta(caminhoLista);

            if (usuarioDto.PerfilFoto != null)
            {
                var caminhoArquivo = await geralService.SalvarArquivo(
                    usuarioDto.PerfilFoto,
                    caminho
                );

                usuario.PerfilFoto = Path.GetFileName(caminhoArquivo);
                await _context.SaveChangesAsync();
            }

            var token = TokenService.GenerateToken(usuario);
            usuario.Senha = "";

            return Ok(new Message<object>($"Bem-vindo, {usuario.Nome}!", new
            {
                usuario,
                token
            }, false));
        }


        // POST: api/Usuarios/login
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("login")]
        public async Task<ActionResult<Usuario>> PostUsuarioLogin(Usuario usuario)
        {
            var existeusuario = await _context.Usuarios.Where(u => u.Apelido == usuario.Apelido).FirstOrDefaultAsync();

            if (existeusuario == null)
            {
                return NotFound(new Message<object>("Usuário não encontrado.", new { }, true));
            }

            if (usuario.Senha == null || !BCrypt.Net.BCrypt.Verify(usuario.Senha, existeusuario.Senha))
            {
                return BadRequest(new Message<object>("Senha inválida.", new { }, true));
            }

            var token = TokenService.GenerateToken(existeusuario);
            usuario.Senha = "";
            return Ok(new Message<object>($"Bem-vindo, {existeusuario.Nome}!", new
            {
                usuario = existeusuario,
                token = token
            }, false));

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

            return Ok(new Message<object>("Usuário excluído com sucesso!", new { }, false));
        }

        private bool UsuarioExists(int id)
        {
            return _context.Usuarios.Any(e => e.UsuarioId == id);
        }
    }
}
