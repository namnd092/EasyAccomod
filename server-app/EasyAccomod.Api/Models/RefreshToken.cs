namespace EasyAccomod.Api.Models;

// One refresh token of a login session. Only the SHA-256 hash of the token is stored. Every
// rotation issues a new token in the same family, so reuse of an old token can be detected.
public class RefreshToken
{
    public int Id { get; set; }

    public string UserId { get; set; }

    public ApplicationUser User { get; set; }

    public string TokenHash { get; set; }

    public Guid FamilyId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime ExpiresAt { get; set; }

    // Set when the token stops being usable: rotated, logged out, or its family was revoked.
    public DateTime? RevokedAt { get; set; }

    // Set only when the token was replaced by a rotation (not by a logout or a family revoke).
    public DateTime? RotatedAt { get; set; }

    public int? ReplacedByTokenId { get; set; }
}
