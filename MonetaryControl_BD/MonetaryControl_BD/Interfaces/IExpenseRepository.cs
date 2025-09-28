using MonetaryControl_BD.Models;

namespace MonetaryControl_BD.Interfaces
{
    public interface IExpenseRepository
    {
        Task<IEnumerable<Expense>> GetAllAsync();
        Task<Expense?> GetByIdAsync(int ExpenseId);
        Task<Expense> AddAsync(Expense expense);
        Task<Expense?> UpdateAsync(Expense expense);
        Task<bool> DeleteAsync(int ExpenseId);
    }
}
