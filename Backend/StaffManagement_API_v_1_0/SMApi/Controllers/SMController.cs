using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using SMApi.Model;

namespace SMApi.Controllers
{
    [Route("api/[controller]")]
    public class SMController : Controller
    {
        private readonly PersonDb _context;
        public bool initialised = true;

        public SMController(PersonDb context)
        {
            _context = context;
        }

        // GET (all) 
        [HttpGet]
        public IEnumerable<Person> GetAll()
        {
            return _context.PersonList.ToList();
        }

        // GET (by ID)
        [HttpGet("{id}", Name ="SMId")]
        public IActionResult GetById(int id)
        {
            var item = _context.PersonList.FirstOrDefault(t => t.Id == id);
            if (item == null)
            {
                return NotFound();
            }
            return new ObjectResult(item);
        }
        
        // DELETE 
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var todo = _context.PersonList.FirstOrDefault(t => t.Id == id);
            if (todo == null)
            {
                return NotFound();
            }

            _context.PersonList.Remove(todo);
            _context.SaveChanges();
            return new NoContentResult();
        }

        // POST 
        [HttpPost]
        public IActionResult Create([FromBody] Person person)
        {
            if (person == null)
            {
                return BadRequest();
            }

            _context.PersonList.Add(person);
            _context.SaveChanges();

            return CreatedAtRoute("SMId", new { id = person.Id }, person);
        }
    }
}
