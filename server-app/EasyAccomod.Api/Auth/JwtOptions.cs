namespace EasyAccomod.Api.Auth;

public class JwtOptions
{
    public string Key { get; set; }

    public string Issuer { get; set; }

    public string Audience { get; set; }

    // The access token is short-lived and kept in memory by the client; the refresh token
    // (an HttpOnly cookie, see RefreshTokenService) is what keeps a session going.
    public int AccessTokenMinutes { get; set; } = 15;

    public int RefreshTokenDays { get; set; } = 30;
}
