using Microsoft.AspNetCore.Mvc;
using MonetaryControl_BD.DTO;
using MonetaryControl_BD.Service;
using System.Threading.Tasks;

namespace MonetaryControl_BD.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserRoleController : ControllerBase
    {
        private readonly IUserRoleService _service;
        public UserRoleController(IUserRoleService service) => _service = service;

        [HttpGet("ListUserRoles")]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("ListUserRole/{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var role = await _service.GetByIdAsync(id);
            return role is null ? NotFound() : Ok(role);
        }

        [HttpPost("CreateUserRole")]
        public async Task<IActionResult> Create([FromBody] CreateUserRoleDto dto)
        {
            try
            {
                var created = await _service.CreateAsync(dto, "admin");
                return CreatedAtAction(nameof(Get), new { id = created.UserRolesId }, created);
            }
            catch (KeyNotFoundException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("UpdateUserRole/{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdatUserRoleDto dto)
        {
            try
            {
                var updated = await _service.UpdateAsync(id, dto, "admin");
                return updated is null ? NotFound() : Ok(updated);
            }
            catch (KeyNotFoundException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("DeleteUserRole/{id:int}")]
        public async Task<IActionResult> Delete(int id)
            => (await _service.DeleteAsync(id)) ? NoContent() : NotFound();
    }
}
