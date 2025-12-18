using MonetaryControl_BD.Models;

namespace MonetaryControl_BD.Interfaces
{
    public interface ISavingRepository
    {

        Task<IEnumerable<Saving>> GetAllAsync();
        Task<Saving?> GetByIdAsync(int SavingId);
        Task<Saving> AddAsync(Saving saving);
        Task<Saving?> UpdateAsync(Saving saving);
        Task<bool> DeleteAsync(int SavingId);
    }
}
