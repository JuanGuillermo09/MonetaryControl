using Microsoft.EntityFrameworkCore;
using MonetaryControl_BD.Interfaces;
using MonetaryControl_BD.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MonetaryControl_BD.Repository
{
    public class UserRoleRepository : IUserRoleRepository
    {
        private readonly AppDbContext _context;

        public UserRoleRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserRole>> GetAllAsync()
        {
            return await _context.UserRoles.ToListAsync();
        }

        public async Task<UserRole?> GetByIdAsync(int userRolesId)
        {
            return await _context.UserRoles.FindAsync(userRolesId);
        }

        public async Task<UserRole> CreateAsync(UserRole role)
        {
            _context.UserRoles.Add(role);
            await _context.SaveChangesAsync();
            return role;
        }

        public async Task<UserRole?> UpdateAsync(UserRole role)
        {
            var existing = await _context.UserRoles.FindAsync(role.UserRolesId);
            if (existing == null) return null;

            existing.RolesName = role.RolesName;
            existing.Description = role.Description;
            existing.IsActive = role.IsActive;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int userRolesId)
        {
            var entity = await _context.UserRoles.FindAsync(userRolesId);
            if (entity == null) return false;

            _context.UserRoles.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int userRolesId)
        {
            return await _context.UserRoles.AnyAsync(r => r.UserRolesId == userRolesId);
        }
    }
}
