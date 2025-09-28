using Microsoft.EntityFrameworkCore;
using MonetaryControl_BD.Interfaces;
using MonetaryControl_BD.Models;

namespace MonetaryControl_BD.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;
        public UserRepository(AppDbContext context) => _context = context;

        public async Task<IEnumerable<User>> GetAllAsync() =>
            await _context.Users
                .Include(u => u.UserRoles) // <- trae el rol
                .ToListAsync();

        public async Task<User?> GetByIdAsync(int id) =>
            await _context.Users
                .Include(u => u.UserRoles) // <- trae el rol
                .FirstOrDefaultAsync(u => u.UserId == id);

        public async Task<User> AddAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User?> UpdateAsync(User user)
        {
            var existing = await _context.Users.FindAsync(user.UserId);
            if (existing is null) return null;

            existing.UserName = user.UserName;
            existing.Email = user.Email;
            existing.IsActive = user.IsActive;
            existing.UserRolesId = user.UserRolesId;
            existing.UpdatedAt = DateTime.Now;
            existing.UpdatedBy = user.UpdatedBy;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user is null) return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
