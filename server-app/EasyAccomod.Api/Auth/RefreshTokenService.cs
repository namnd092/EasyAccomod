using System.Security.Cryptography;
using System.Text;
using EasyAccomod.Api.Data;
using EasyAccomod.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace EasyAccomod.Api.Auth;

// Issues, rotates and revokes refresh tokens. The raw token only ever exists in the cookie; the
// database keeps its SHA-256 hash. Presenting a token that was already rotated or revoked is
// treated as theft and revokes its whole family, except for a short grace after a rotation.
public class RefreshTokenService
{
    public const string CookieName = "refresh_token";
    public const string CookiePath = "/api/Account";

    // Revoked rows are kept this long (for reuse detection) before they are cleaned up.
    private static readonly TimeSpan RevokedRetention = TimeSpan.FromDays(7);

    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly JwtOptions _jwtOptions;
    private readonly RefreshTokenSettings _settings;
    private readonly TimeProvider _time;

    public RefreshTokenService(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        IOptions<JwtOptions> jwtOptions,
        RefreshTokenSettings settings,
        TimeProvider time)
    {
        _context = context;
        _userManager = userManager;
        _jwtOptions = jwtOptions.Value;
        _settings = settings;
        _time = time;
    }

    public static string Hash(string rawToken) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(rawToken))).ToLowerInvariant();

    public CookieOptions CookieOptionsFor(DateTime? expiresAt) => new()
    {
        HttpOnly = true,
        Secure = _settings.Secure,
        SameSite = _settings.SameSite,
        Path = CookiePath,
        Expires = expiresAt == null ? null : new DateTimeOffset(expiresAt.Value, TimeSpan.Zero),
    };

    // Starts a new family (a new login).
    public Task<IssuedRefreshToken> StartSessionAsync(string userId) => IssueAsync(userId, Guid.NewGuid());

    // Exchanges a refresh token for a new one, or returns null when it cannot be used.
    public async Task<IssuedRefreshToken> RotateAsync(string rawToken)
    {
        var now = Now();
        var hash = Hash(rawToken);
        var token = await _context.RefreshTokens.FirstOrDefaultAsync(t => t.TokenHash == hash);
        if (token == null || token.ExpiresAt <= now)
            return null;

        var user = await _userManager.FindByIdAsync(token.UserId);
        if (user == null || await _userManager.IsLockedOutAsync(user))
        {
            await RevokeFamilyAsync(token.FamilyId, now);
            return null;
        }

        if (token.RevokedAt == null)
        {
            // Claim the token with one conditional update so two concurrent requests cannot both rotate it.
            var claimed = await _context.RefreshTokens
                .Where(t => t.Id == token.Id && t.RevokedAt == null)
                .ExecuteUpdateAsync(s => s.SetProperty(t => t.RevokedAt, now).SetProperty(t => t.RotatedAt, now));
            if (claimed == 1)
            {
                var next = await IssueAsync(token.UserId, token.FamilyId);
                await _context.RefreshTokens
                    .Where(t => t.Id == token.Id)
                    .ExecuteUpdateAsync(s => s.SetProperty(t => t.ReplacedByTokenId, next.TokenId));
                return next with { User = user };
            }

            // Another request rotated it between the read and the update.
            await _context.Entry(token).ReloadAsync();
        }

        // Already rotated or revoked. Right after a rotation this is two tabs racing, so the
        // session stays alive; a token revoked by logout (no RotatedAt) or rotated longer ago is reuse.
        if (token.RotatedAt is { } rotatedAt
            && now - rotatedAt < TimeSpan.FromSeconds(_settings.ReuseGraceSeconds)
            && await FamilyIsAliveAsync(token.FamilyId, now))
        {
            return (await IssueAsync(token.UserId, token.FamilyId)) with { User = user };
        }

        await RevokeFamilyAsync(token.FamilyId, now);
        return null;
    }

    // Ends the session the token belongs to. Unknown tokens are ignored.
    public async Task RevokeAsync(string rawToken)
    {
        var hash = Hash(rawToken);
        var familyId = await _context.RefreshTokens
            .Where(t => t.TokenHash == hash)
            .Select(t => (Guid?)t.FamilyId)
            .FirstOrDefaultAsync();
        if (familyId != null)
            await RevokeFamilyAsync(familyId.Value, Now());
    }

    private async Task<IssuedRefreshToken> IssueAsync(string userId, Guid familyId)
    {
        var now = Now();

        // Opportunistic cleanup of this user's dead rows.
        var revokedBefore = now - RevokedRetention;
        await _context.RefreshTokens
            .Where(t => t.UserId == userId && (t.ExpiresAt < now || t.RevokedAt < revokedBefore))
            .ExecuteDeleteAsync();

        var rawToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32))
            .Replace('+', '-').Replace('/', '_').TrimEnd('=');
        var token = new RefreshToken
        {
            UserId = userId,
            TokenHash = Hash(rawToken),
            FamilyId = familyId,
            CreatedAt = now,
            ExpiresAt = now.AddDays(_jwtOptions.RefreshTokenDays),
        };
        _context.RefreshTokens.Add(token);
        await _context.SaveChangesAsync();

        return new IssuedRefreshToken(rawToken, token.ExpiresAt, token.Id, null);
    }

    private Task<int> RevokeFamilyAsync(Guid familyId, DateTime now) =>
        _context.RefreshTokens
            .Where(t => t.FamilyId == familyId && t.RevokedAt == null)
            .ExecuteUpdateAsync(s => s.SetProperty(t => t.RevokedAt, now));

    private Task<bool> FamilyIsAliveAsync(Guid familyId, DateTime now) =>
        _context.RefreshTokens.AnyAsync(t => t.FamilyId == familyId && t.RevokedAt == null && t.ExpiresAt > now);

    private DateTime Now() => _time.GetUtcNow().UtcDateTime;
}

public record IssuedRefreshToken(string RawToken, DateTime ExpiresAt, int TokenId, ApplicationUser User);
