using MonetaryControl_BD.DTO;
using MonetaryControl_BD.Helpers;
using MonetaryControl_BD.Interfaces;
using MonetaryControl_BD.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace MonetaryControl_BD.Service
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllAsync();
        Task<UserDto?> GetByIdAsync(int id);
        Task<UserDto> CreateAsync(CreateUserDto dto, string createdBy);
        Task<UserDto?> UpdateAsync(int id, UpdateUserDto dto, string updatedBy);
        Task<bool> DeleteAsync(int id);
    }

    public class UserService : IUserService
    {
        private readonly IUserRepository _users;
        private readonly IUserRoleRepository _roles;

        public UserService(IUserRepository users, IUserRoleRepository roles)
        {
            _users = users;
            _roles = roles;
        }

        public async Task<IEnumerable<UserDto>> GetAllAsync()
        {
            var list = await _users.GetAllAsync();
            return list.Select(u => new UserDto
            {
                UserId = u.UserId,
                UserName = u.UserName,
                Email = u.Email,
                IsActive = u.IsActive,
                UserRolesId = u.UserRolesId,
                RoleName = u.UserRoles.RolesName,
                ProfilePhoto = u.ProfilePhoto != null ? Convert.ToBase64String(u.ProfilePhoto) : null
            });
        }

        public async Task<UserDto?> GetByIdAsync(int id)
        {
            var u = await _users.GetByIdAsync(id);
            if (u is null) return null;

            return new UserDto
            {
                UserId = u.UserId,
                UserName = u.UserName,
                Email = u.Email,
                IsActive = u.IsActive,
                UserRolesId = u.UserRolesId,
                RoleName = u.UserRoles.RolesName,
                Salary = u.Salary,
                //Savings = u.Savings,
                // Convertimos el byte[] a Base64
                ProfilePhoto = u.ProfilePhoto != null
                    ? $"data:image/png;base64,{Convert.ToBase64String(u.ProfilePhoto)}"
                    : null
            };
        }



        public async Task<UserDto> CreateAsync(CreateUserDto dto, string createdBy)
        {
            if (!await _roles.ExistsAsync(dto.UserRolesId))
                throw new KeyNotFoundException("The role does not exist.");

            var entity = new User
            {
                UserName = dto.UserName,
                Email = dto.Email,
                Password = PasswordHelper.HashPassword(dto.Password),
                IsActive = true,
                CreatedAt = DateTime.Now,
                CreatedBy = createdBy,
                UserRolesId = dto.UserRolesId
            };

            var saved = await _users.AddAsync(entity);

            return new UserDto
            {
                UserId = saved.UserId,
                UserName = saved.UserName,
                Email = saved.Email,
                IsActive = saved.IsActive,
                UserRolesId = saved.UserRolesId,
                RoleName = "",
            };
        }

        public async Task<UserDto?> UpdateAsync(int id, UpdateUserDto dto, string updatedBy)
        {
            if (!await _roles.ExistsAsync(dto.UserRolesId))
                throw new KeyNotFoundException("The role does not exist.");

            var existing = await _users.GetByIdAsync(id);
            if (existing == null) return null;

            existing.Salary = dto.Salary;
            existing.UserName = dto.UserName;
            existing.Email = dto.Email;
            existing.IsActive = dto.IsActive;
            existing.UserRolesId = dto.UserRolesId;
            existing.UpdatedAt = DateTime.Now;
            existing.UpdatedBy = updatedBy;

            // Guardar imagen como blob en SQL
            if (dto.ProfilePhoto != null && dto.ProfilePhoto.Length > 0)
            {
                using var ms = new MemoryStream();
                await dto.ProfilePhoto.CopyToAsync(ms);
                existing.ProfilePhoto = ms.ToArray(); // VARBINARY(MAX) en la DB
            }

            var updated = await _users.UpdateAsync(existing);
            if (updated == null) return null;

            return new UserDto
            {
                UserId = updated.UserId,
                UserName = updated.UserName,
                Email = updated.Email,
                IsActive = updated.IsActive,
                UserRolesId = updated.UserRolesId,
                RoleName = updated.UserRoles?.RolesName ?? "",
                ProfilePhoto = updated.ProfilePhoto != null ? Convert.ToBase64String(updated.ProfilePhoto) : null,
                Salary = updated.Salary
            };
        }

        public Task<bool> DeleteAsync(int id) => _users.DeleteAsync(id);
    }
}
