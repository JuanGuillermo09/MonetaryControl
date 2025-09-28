using Microsoft.AspNetCore.Mvc;
using MonetaryControl_BD.DTO;
using MonetaryControl_BD.Service;


namespace MonetaryControl_BD.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _service;
        public UserController(IUserService service) => _service = service;

        [HttpGet("ListUsers")]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("ListUser/{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var user = await _service.GetByIdAsync(id);
            return user is null ? NotFound() : Ok(user);
        }

        [HttpPost("CreateUser")]
        public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
        {
            try
            {
                var created = await _service.CreateAsync(dto, "admin");
                return CreatedAtAction(nameof(Get), new { id = created.UserId }, created);
            }
            catch (KeyNotFoundException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("UpdateUser/{id:int}")]
        public async Task<IActionResult> Update(int id, [FromForm] UpdateUserDto dto)
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



        [HttpDelete("DeleteUser{id:int}")]
        public async Task<IActionResult> Delete(int id)
            => (await _service.DeleteAsync(id)) ? NoContent() : NotFound();
    }
}
