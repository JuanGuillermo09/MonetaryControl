using Microsoft.EntityFrameworkCore;
using MonetaryControl_BD.Interfaces;
using MonetaryControl_BD.Models;

namespace MonetaryControl_BD.Repository
{
    public class LoginRepository : ILoginRepository
    {
        private readonly AppDbContext _context;

        public LoginRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users
                .Include(u => u.UserRoles) // trae la relación
                .FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}
