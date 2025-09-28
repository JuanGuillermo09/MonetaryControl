using Microsoft.EntityFrameworkCore;
using MonetaryControl_BD.Interfaces;
using MonetaryControl_BD.Models;

namespace MonetaryControl_BD.Repository
{
    public class ExpenseRepository : IExpenseRepository
    {
        private readonly AppDbContext _context;
        public ExpenseRepository(AppDbContext context) => _context = context;

        // ✅ Listar todos los gastos con el nombre del usuario
        public async Task<IEnumerable<Expense>> GetAllAsync() =>
            await _context.Expenses
                .Include(e => e.User) // Trae info del usuario
                .ToListAsync();

        // ✅ Obtener un gasto por Id
        public async Task<Expense?> GetByIdAsync(int expenseId) =>
            await _context.Expenses
                .Include(e => e.User) // Incluye el usuario asociado
                .FirstOrDefaultAsync(e => e.ExpenseId == expenseId);

        // ✅ Crear un gasto
        public async Task<Expense> AddAsync(Expense expense)
        {
            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();
            return expense;
        }

        // ✅ Actualizar un gasto
        public async Task<Expense?> UpdateAsync(Expense expense)
        {
            var existing = await _context.Expenses.FindAsync(expense.ExpenseId);
            if (existing is null) return null;

            existing.Date = expense.Date;
            existing.Description = expense.Description;
            existing.Category = expense.Category;
            existing.Amount = expense.Amount;

            // Manejo de blobs (solo si llegan nuevos valores)
            if (expense.Signature != null && expense.Signature.Length > 0)
                existing.Signature = expense.Signature;

            if (expense.Invoice != null && expense.Invoice.Length > 0)
                existing.Invoice = expense.Invoice;

            existing.UserId = expense.UserId;

            await _context.SaveChangesAsync();
            return existing;
        }

        // ✅ Eliminar un gasto
        public async Task<bool> DeleteAsync(int expenseId)
        {
            var expense = await _context.Expenses.FindAsync(expenseId);
            if (expense is null) return false;

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
