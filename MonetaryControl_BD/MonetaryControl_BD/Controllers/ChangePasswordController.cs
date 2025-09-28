using Microsoft.AspNetCore.Mvc;
using MonetaryControl_BD.DTO;
using MonetaryControl_BD.Service;

namespace MonetaryControl_BD.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChangePasswordController : ControllerBase
    {
        private readonly IChangePasswordService _changePasswordService;

        public ChangePasswordController(IChangePasswordService changePasswordService)
        {
            _changePasswordService = changePasswordService;
        }

        [HttpPost]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            Console.WriteLine($"DTO recibido: Token={dto?.Token}, NewPassword={dto?.NewPassword}");

            if (dto == null || string.IsNullOrWhiteSpace(dto.Token) || string.IsNullOrWhiteSpace(dto.NewPassword))
            {
                return BadRequest(new { message = "Datos inválidos." });
            }

            var result = await _changePasswordService.ChangePasswordAsync(dto.Token, dto.NewPassword);

            if (!result)
                return BadRequest(new { message = "Token inválido o usuario no encontrado." });

            return Ok(new { message = "Contraseña cambiada exitosamente." });
        }
    }
}
