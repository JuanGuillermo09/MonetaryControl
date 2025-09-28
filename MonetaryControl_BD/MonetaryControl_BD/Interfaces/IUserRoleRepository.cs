using MonetaryControl_BD.DTO;
using MonetaryControl_BD.Models;

namespace MonetaryControl_BD.Interfaces
{
    public interface IUserRoleRepository
    {
        Task<IEnumerable<UserRole>> GetAllAsync();
        Task<UserRole?> GetByIdAsync(int userRolesId);
        Task<UserRole> CreateAsync(UserRole UserRole);
        Task<UserRole?> UpdateAsync(UserRole UserRole);
        Task<bool> DeleteAsync(int userRolesId);
        Task<bool> ExistsAsync(int userRolesId);
    }
}
