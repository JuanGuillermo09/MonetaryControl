namespace MonetaryControl_BD.DTO
{
    public class UserDto
    {
        public int UserId { get; set; }
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public bool IsActive { get; set; }
        public decimal? Salary { get; set; }
        
        // Enviamos Base64 al frontend
        public string? ProfilePhoto { get; set; }

        public int UserRolesId { get; set; }
        public string RoleName { get; set; } = null!; // <- nombre del rol
    }

    public class CreateUserDto
    {
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public int UserRolesId { get; set; }
    }

    public class UpdateUserDto
    {
        public decimal? Salary { get; set; }
        public IFormFile? ProfilePhoto { get; set; }
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public bool IsActive { get; set; }
        public int UserRolesId { get; set; }
    }


}
