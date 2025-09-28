using MonetaryControl_BD.Models;

namespace MonetaryControl_BD.DTO
{
    public class ExpenseDto
    {

        public int ExpenseId { get; set; }

        public DateTime Date { get; set; }

        public string Description { get; set; } = null!;

        public string? Category { get; set; }

        public decimal Amount { get; set; }

        public string? Signature { get; set; }

        public string? Invoice { get; set; }

        public int UserId { get; set; }
        public string UserName { get; set; } = null!;
    }


    public class CreateExpenseDto
    {
        public int UserId { get; set; }
        public string Description { get; set; } = null!;
        public string Category { get; set; } = null!;
        public string Amount { get; set; } = null!;
        public IFormFile? Signature { get; set; } = null!;
        public IFormFile? Invoice { get; set; }
    }


    public class UpdateExpenseDto
    {
        public string Description { get; set; } = null!;
        public string Category { get; set; } = null!;
        public string Amount { get; set; } = null!;
        public IFormFile? Signature { get; set; } = null!;
        public IFormFile? Invoice { get; set; }
    }
}
