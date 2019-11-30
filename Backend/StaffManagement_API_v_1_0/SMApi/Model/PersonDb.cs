using Microsoft.EntityFrameworkCore;

namespace SMApi.Model
{
    public class PersonDb :DbContext
    {
        public PersonDb(DbContextOptions<PersonDb> options) : base(options)
        { 

        }
        public DbSet<Person> PersonList { get; set; }
    }
}

