using api.Models;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using NuGet.Configuration;
using api.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using api;
using api.DTO;

namespace api.Services
{
    public class TokenService
    {
        public enum ClaimKeys { unique_name }
        public static string GenerateToken(Usuario usuario)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(Config.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, usuario.Nome.ToString()),
                    new Claim(ClaimTypes.GivenName, usuario.Nome.ToString()),
                    new Claim(ClaimTypes.SerialNumber, usuario.UsuarioId.ToString()),
                    new Claim(ClaimTypes.Actor, usuario.UsuarioId.ToString()),
                }),
                Expires = DateTime.UtcNow.AddHours(8),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public static string GetClaimValue(Microsoft.AspNetCore.Http.HttpContext context, ClaimKeys claimkey)
        {
            // "unique_name"
            return Services.TokenService.GetTokenElement(context).Claims.Where(s => s.Type == claimkey.ToString()).FirstOrDefault().Value;
        }
        public static int GetTokenUserId(Microsoft.AspNetCore.Http.HttpContext context)
        {
            var usuarioId = Convert.ToInt32(GetTokenElement(context).Actor);
            return usuarioId;
        }

        public static JwtSecurityToken GetTokenElement(Microsoft.AspNetCore.Http.HttpContext context)
        {
            var t = context.Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptografado = tokenHandler.ReadToken(t);
            return ((JwtSecurityToken)tokenDescriptografado);
        }

        
    }
}
