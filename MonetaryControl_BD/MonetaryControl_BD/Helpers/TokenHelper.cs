using System.IdentityModel.Tokens.Jwt;

namespace MonetaryControl_BD.Helpers
{
    public static class TokenHelper
    {
        public static int? ValidateToken(string token)
        {
            // Aquí decodificas el JWT y sacas el claim "UserId"
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null) return null;

            return int.Parse(userIdClaim.Value);
        }
    }

}
