using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MonetaryControl_BD.DTO;
using MonetaryControl_BD.Interfaces;
using MonetaryControl_BD.Models;

namespace MonetaryControl_BD.Service
{
    public interface IExpenseService
    {
        Task<IEnumerable<ExpenseDto>> GetAllAsync();
        Task<ExpenseDto?> GetByIdAsync(int expenseId);
        Task<ExpenseDto> CreateAsync(CreateExpenseDto dto);
        Task<ExpenseDto?> UpdateAsync(int expenseId, UpdateExpenseDto dto);
        Task<bool> DeleteAsync(int expenseId);
    }


    public class ExpenseService : IExpenseService
    {
        private readonly IExpenseRepository _expenses;
        private readonly AppDbContext _context;

        public ExpenseService(IExpenseRepository expenses, AppDbContext context)
        {
            _expenses = expenses;
            _context = context;
        }

        public async Task<IEnumerable<ExpenseDto>> GetAllAsync()
        {
            var list = await _context.Expenses
                .Include(e => e.User)
                .ToListAsync();

            return list.Select(e => new ExpenseDto
            {
                ExpenseId = e.ExpenseId,
                Date = e.Date,
                Description = e.Description,
                Category = e.Category,
                Amount = e.Amount,
                Signature = e.Signature != null ? Convert.ToBase64String(e.Signature) : null,
                Invoice = e.Invoice != null ? Convert.ToBase64String(e.Invoice) : null,
                UserId = e.UserId,
                UserName = e.User.UserName
            });
        }

        public async Task<ExpenseDto?> GetByIdAsync(int ExpensesId)
        {
            var e = await _context.Expenses
                .Include(x => x.User)
                .FirstOrDefaultAsync(x => x.ExpenseId == ExpensesId);

            if (e is null) return null;

            return new ExpenseDto
            {
                ExpenseId = e.ExpenseId,
                Date = e.Date,
                Description = e.Description,
                Category = e.Category,
                Amount = e.Amount,
                Signature = e.Signature != null ? Convert.ToBase64String(e.Signature) : null,
                Invoice = e.Invoice != null ? Convert.ToBase64String(e.Invoice) : null,
                UserId = e.UserId,
                UserName = e.User.UserName
            };
        }

        public async Task<ExpenseDto> CreateAsync(CreateExpenseDto dto)
        {
            var entity = new Expense
            {
                Description = dto.Description,
                Category = dto.Category,
                Amount = decimal.Parse(dto.Amount),
                Date = DateTime.Now
            };

            // ✅ Guardar firma como varbinary(MAX)
            if (dto.Signature != null && dto.Signature.Length > 0)
            {
                using var ms = new MemoryStream();
                await dto.Signature.CopyToAsync(ms);
                entity.Signature = ms.ToArray();
            }

            // ✅ Guardar factura como varbinary(MAX)
            if (dto.Invoice != null && dto.Invoice.Length > 0)
            {
                using var ms = new MemoryStream();
                await dto.Invoice.CopyToAsync(ms);
                entity.Invoice = ms.ToArray();
            }

            var saved = await _expenses.AddAsync(entity);

            return new ExpenseDto
            {
                Description = saved.Description,
                Category = saved.Category,
                Amount = saved.Amount,
                // ⚡ Mandamos como Base64 al frontend
                Signature = saved.Signature != null ? Convert.ToBase64String(saved.Signature) : null,
                Invoice = saved.Invoice != null ? Convert.ToBase64String(saved.Invoice) : null
            };
        }


        public async Task<ExpenseDto?> UpdateAsync(int ExpensesId, UpdateExpenseDto dto)
        {
            var existing = await _context.Expenses
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.ExpenseId == ExpensesId);

            if (existing == null) return null;

            existing.Description = dto.Description;
            existing.Category = dto.Category;
            existing.Amount = decimal.Parse(dto.Amount);

            // Guardar firma como blob
            if (dto.Signature != null)
            {
                using var ms = new MemoryStream();
                await dto.Signature.CopyToAsync(ms);
                existing.Signature = ms.ToArray();
            }

            // Guardar factura como blob
            if (dto.Invoice != null)
            {
                using var ms = new MemoryStream();
                await dto.Invoice.CopyToAsync(ms);
                existing.Invoice = ms.ToArray();
            }

            var updated = await _expenses.UpdateAsync(existing);
            if (updated == null) return null;

            return new ExpenseDto
            {
                ExpenseId = updated.ExpenseId,
                Date = updated.Date,
                Description = updated.Description,
                Category = updated.Category,
                Amount = updated.Amount,
                Signature = updated.Signature != null ? Convert.ToBase64String(updated.Signature) : null,
                Invoice = updated.Invoice != null ? Convert.ToBase64String(updated.Invoice) : null,
                UserId = updated.UserId,
                UserName = updated.User.UserName
            };
        }

        public Task<bool> DeleteAsync(int id) => _expenses.DeleteAsync(id);
    }
}
