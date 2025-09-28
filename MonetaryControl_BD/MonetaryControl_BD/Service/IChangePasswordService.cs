using MonetaryControl_BD.Helpers;
using MonetaryControl_BD.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;

namespace MonetaryControl_BD.Service
{
    public interface IChangePasswordService
    {
        Task<bool> ChangePasswordAsync(string token, string newPassword); // 🔹 string
    }

    public class ChangePasswordService : IChangePasswordService
    {
        private readonly AppDbContext _context;

        public ChangePasswordService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ChangePasswordAsync(string token, string newPassword)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

            if (userIdClaim == null) return false;
            if (!int.TryParse(userIdClaim.Value, out var userId))
                return false;

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            user.Password = PasswordHelper.HashPassword(newPassword);

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
