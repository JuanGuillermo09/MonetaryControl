using MonetaryControl_BD.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MonetaryControl_BD.Interfaces
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<User?> GetByIdAsync(int UserId);
        Task<User> AddAsync(User user);
        Task<User?> UpdateAsync(User user);
        Task<bool> DeleteAsync(int UserId);
    }
}
