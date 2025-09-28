using System;
using System.Collections.Generic;

namespace MonetaryControl_BD.Models;

public partial class Expense
{
    public int ExpenseId { get; set; }

    public int UserId { get; set; }

    public DateTime Date { get; set; }

    public string Description { get; set; } = null!;

    public string? Category { get; set; }

    public decimal Amount { get; set; }

    public byte[]? Signature { get; set; }

    public byte[]? Invoice { get; set; }

    public virtual User User { get; set; } = null!;
}
