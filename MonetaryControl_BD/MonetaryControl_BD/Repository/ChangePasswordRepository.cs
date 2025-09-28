using Microsoft.EntityFrameworkCore;
using MonetaryControl_BD.Helpers;
using MonetaryControl_BD.Interfaces;
using MonetaryControl_BD.Models;

public class ChangePasswordRepository : IChangePasswordRepository
{
    private readonly AppDbContext _context;

    public ChangePasswordRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> ChangePasswordAsync(string token, string newPassword)
    {
        int? userId = TokenHelper.ValidateToken(token);
        if (userId == null) return false;

        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
        if (user == null) return false;

        user.Password = PasswordHelper.HashPassword(newPassword);

        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        return true;
    }
}
