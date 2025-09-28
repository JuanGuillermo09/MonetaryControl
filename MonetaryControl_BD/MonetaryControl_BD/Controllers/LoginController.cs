using Microsoft.AspNetCore.Mvc;
using MonetaryControl_BD.DTO;
using MonetaryControl_BD.Service;

namespace MonetaryControl_BD.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly ILoginService _loginService;

        public LoginController(ILoginService loginService)
        {
            _loginService = loginService;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var response = await _loginService.AuthenticateAsync(dto);
            if (response == null)
                return Unauthorized(new { message = "Credenciales inválidas" });

            return Ok(response);
        }

    }
}
