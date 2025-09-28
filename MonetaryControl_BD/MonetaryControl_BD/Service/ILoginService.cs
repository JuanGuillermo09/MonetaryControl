using MonetaryControl_BD.DTO;
using MonetaryControl_BD.Interfaces;
using MonetaryControl_BD.Models;
using MonetaryControl_BD.Helpers;  // 👈 importa tu PasswordHelper
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MonetaryControl_BD.Service
{
    public interface ILoginService
    {
        Task<AuthResponse?> AuthenticateAsync(LoginDto loginDto);
    }

    public class LoginService : ILoginService
    {
        private readonly ILoginRepository _loginRepository;
        private readonly IConfiguration _config;

        public LoginService(ILoginRepository loginRepository, IConfiguration config)
        {
            _loginRepository = loginRepository;
            _config = config;
        }

        public async Task<AuthResponse?> AuthenticateAsync(LoginDto loginDto)
        {
            var user = await _loginRepository.GetByEmailAsync(loginDto.Email);
            if (user == null)
                return null;

            // 🔐 Verificación con tu PasswordHelper
            if (!PasswordHelper.VerifyPassword(loginDto.Password, user.Password))
                return null;

            var token = GenerateJwtToken(user);

            return new AuthResponse
            {
                Token = token,
                UserName = user.UserName,
                Email = user.Email,
                UserId = user.UserId,
                UserRolesId = user.UserRolesId,
                RoleName = user.UserRoles.RolesName
            };
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(ClaimTypes.Role, user.UserRoles.RolesName)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
