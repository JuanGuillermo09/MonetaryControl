using MonetaryControl_BD.Models;

namespace MonetaryControl_BD.Interfaces
{
    public interface ILoginRepository
    {
        Task<User?> GetByEmailAsync(string email);
    }
}
