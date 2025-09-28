namespace MonetaryControl_BD.DTO
{
    public class LoginDto
    {    
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class AuthResponse
    {
        public string Token { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public int UserId { get; set; }
        public int UserRolesId { get; set; }
        public string RoleName { get; set; } = null!; // <- nombre del rol
    }
}
