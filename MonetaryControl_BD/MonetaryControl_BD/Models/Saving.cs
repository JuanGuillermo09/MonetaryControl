using System;
using System.Collections.Generic;

namespace MonetaryControl_BD.Models;

public partial class Saving
{
    public int SavingsId { get; set; }

    public int UserId { get; set; }

    public decimal Amount { get; set; }

    public DateTime SavingsDate { get; set; }

    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
