using MonetaryControl_BD.DTO;
using MonetaryControl_BD.Interfaces;
using MonetaryControl_BD.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MonetaryControl_BD.Service
{
    public interface IUserRoleService
    {
        Task<IEnumerable<UserRoleDto>> GetAllAsync();
        Task<UserRoleDto?> GetByIdAsync(int id);
        Task<UserRoleDto> CreateAsync(CreateUserRoleDto dto, string createdBy);
        Task<UserRoleDto?> UpdateAsync(int id, UpdatUserRoleDto dto, string updatedBy);
        Task<bool> DeleteAsync(int id);
    }

    public class UserRoleService : IUserRoleService
    {
        private readonly IUserRoleRepository _rolesRepo;

        public UserRoleService(IUserRoleRepository rolesRepo)
        {
            _rolesRepo = rolesRepo;
        }

        public async Task<IEnumerable<UserRoleDto>> GetAllAsync()
        {
            var list = await _rolesRepo.GetAllAsync();
            return list.Select(r => new UserRoleDto
            {
                UserRolesId = r.UserRolesId,
                RolesName = r.RolesName,
                Description = r.Description,
                IsActive = r.IsActive
            });
        }

        public async Task<UserRoleDto?> GetByIdAsync(int id)
        {
            var r = await _rolesRepo.GetByIdAsync(id);
            if (r == null) return null;

            return new UserRoleDto
            {
                UserRolesId = r.UserRolesId,
                RolesName = r.RolesName,
                Description = r.Description,
                IsActive = r.IsActive
            };
        }

        public async Task<UserRoleDto> CreateAsync(CreateUserRoleDto dto, string createdBy)
        {
            var entity = new UserRole
            {
                RolesName = dto.RolesName,
                Description = dto.Description,
                IsActive = true,
                CreatedAt = DateTime.Now,
                CreatedBy = createdBy
            };

            var saved = await _rolesRepo.CreateAsync(entity);

            return new UserRoleDto
            {
                UserRolesId = saved.UserRolesId,
                RolesName = saved.RolesName,
                Description = saved.Description,
                IsActive = saved.IsActive
            };
        }

        public async Task<UserRoleDto?> UpdateAsync(int id, UpdatUserRoleDto dto, string updatedBy)
        {
            var toUpdate = new UserRole
            {
                UserRolesId = id,
                RolesName = dto.RolesName,
                Description = dto.Description,
                UpdatedAt = DateTime.Now,
                UpdatedBy = updatedBy
            };

            var updated = await _rolesRepo.UpdateAsync(toUpdate);
            if (updated == null) return null;

            return new UserRoleDto
            {
                UserRolesId = updated.UserRolesId,
                RolesName = updated.RolesName,
                Description = updated.Description,
                IsActive = updated.IsActive
            };
        }

        public Task<bool> DeleteAsync(int id)
        {
            return _rolesRepo.DeleteAsync(id);
        }
    }
}
