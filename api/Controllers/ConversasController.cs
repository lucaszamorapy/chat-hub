using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConversasController : ControllerBase
    {
        private readonly ChatContext _context;

        public ConversasController(ChatContext context)
        {
            _context = context;
        }

        // GET: api/Conversas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Conversa>>> GetConversas()
        {
            return await _context.Conversas.ToListAsync();
        }

        // GET: api/Conversas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Conversa>> GetConversa(int id)
        {
            var conversa = await _context.Conversas.FindAsync(id);

            if (conversa == null)
            {
                return NotFound();
            }

            return conversa;
        }

        // PUT: api/Conversas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutConversa(int id, Conversa conversa)
        {
            if (id != conversa.ConversaId)
            {
                return BadRequest();
            }

            _context.Entry(conversa).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ConversaExists(id))
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

        // POST: api/Conversas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Conversa>> PostConversa(Conversa conversa)
        {
            _context.Conversas.Add(conversa);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetConversa", new { id = conversa.ConversaId }, conversa);
        }

        // DELETE: api/Conversas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConversa(int id)
        {
            var conversa = await _context.Conversas.FindAsync(id);
            if (conversa == null)
            {
                return NotFound();
            }

            _context.Conversas.Remove(conversa);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ConversaExists(int id)
        {
            return _context.Conversas.Any(e => e.ConversaId == id);
        }
    }
}
