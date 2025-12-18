using System;
using System.Collections.Generic;

namespace MonetaryControl_BD.Models;

public partial class User
{
    public int UserId { get; set; }

    public string UserName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string? CreatedBy { get; set; }

    public string? UpdatedBy { get; set; }

    public int UserRolesId { get; set; }

    public decimal? Salary { get; set; }

    public byte[]? ProfilePhoto { get; set; }

    public virtual ICollection<Expense> Expenses { get; set; } = new List<Expense>();

    public virtual ICollection<Saving> Savings { get; set; } = new List<Saving>();

    public virtual UserRole UserRoles { get; set; } = null!;
}
