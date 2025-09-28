namespace MonetaryControl_BD.DTO
{
    public class UserRoleDto
    {
        public int UserRolesId { get; set; }
        public string RolesName { get; set; } = null!;
        public string Description { get; set; } = null!;
        public bool IsActive { get; set; }

        //public string UserName { get; set; } = null!; // <- nombre del rol
    }

    public class CreateUserRoleDto
    {
        public string RolesName { get; set; } = null!;
        public string Description { get; set; } = null!;

    }

    public class UpdatUserRoleDto
    {
        public string RolesName { get; set; } = null!;
        public string Description { get; set; } = null!;

    }
}
