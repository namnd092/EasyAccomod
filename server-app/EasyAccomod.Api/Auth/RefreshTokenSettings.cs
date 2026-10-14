namespace EasyAccomod.Api.Auth;

// Cookie and rotation settings of the refresh token (configuration section "Auth").
public class RefreshTokenSettings
{
    public SameSiteMode SameSite { get; init; } = SameSiteMode.Strict;

    public bool Secure { get; init; } = true;

    // A token replaced less than this many seconds ago may still be presented once more (two
    // tabs refreshing at the same moment) without the whole session being treated as stolen.
    public int ReuseGraceSeconds { get; init; } = 10;

    public static RefreshTokenSettings Load(IConfiguration configuration, bool isDevelopment)
    {
        var sameSiteText = configuration["Auth:RefreshCookieSameSite"];
        var sameSite = SameSiteMode.Strict;
        if (!string.IsNullOrWhiteSpace(sameSiteText)
            && !(Enum.TryParse(sameSiteText, true, out sameSite)
                 && sameSite is SameSiteMode.Strict or SameSiteMode.Lax or SameSiteMode.None))
        {
            throw new InvalidOperationException(
                $"Auth:RefreshCookieSameSite must be Strict, Lax or None (got '{sameSiteText}').");
        }

        // Secure everywhere except Development, where the API runs over plain http.
        var secure = !isDevelopment;
        var secureText = configuration["Auth:RefreshCookieSecure"];
        if (!string.IsNullOrWhiteSpace(secureText) && !bool.TryParse(secureText, out secure))
            throw new InvalidOperationException($"Auth:RefreshCookieSecure must be true or false (got '{secureText}').");

        if (sameSite == SameSiteMode.None && !secure)
        {
            throw new InvalidOperationException(
                "Auth:RefreshCookieSameSite=None requires Auth:RefreshCookieSecure=true; browsers drop SameSite=None cookies that are not Secure.");
        }

        var graceSeconds = configuration.GetValue("Auth:RefreshReuseGraceSeconds", 10);
        if (graceSeconds < 0)
            throw new InvalidOperationException("Auth:RefreshReuseGraceSeconds must not be negative.");

        return new RefreshTokenSettings { SameSite = sameSite, Secure = secure, ReuseGraceSeconds = graceSeconds };
    }
}
