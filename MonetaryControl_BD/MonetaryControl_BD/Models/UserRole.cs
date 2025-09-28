using System;
using System.Collections.Generic;

namespace MonetaryControl_BD.Models;

public partial class UserRole
{
    public int UserRolesId { get; set; }

    public string RolesName { get; set; } = null!;

    public string? Description { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string? CreatedBy { get; set; }

    public string? UpdatedBy { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
