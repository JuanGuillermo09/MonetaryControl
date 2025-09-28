using System.Threading.Tasks;

namespace MonetaryControl_BD.Interfaces
{
    public interface IChangePasswordRepository
    {
        Task<bool> ChangePasswordAsync(string token, string newPassword); // 🔹 string
    }
}
