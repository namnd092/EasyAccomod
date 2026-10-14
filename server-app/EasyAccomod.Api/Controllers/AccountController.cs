using EasyAccomod.Api.Auth;
using EasyAccomod.Api.Data;
using EasyAccomod.Api.Dtos;
using EasyAccomod.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace EasyAccomod.Api.Controllers;

[Authorize]
[Route("api/Account")]
public class AccountController : ApiControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly JwtTokenService _tokenService;
    private readonly RefreshTokenService _refreshTokens;

    public AccountController(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        JwtTokenService tokenService,
        RefreshTokenService refreshTokens)
    {
        _context = context;
        _userManager = userManager;
        _tokenService = tokenService;
        _refreshTokens = refreshTokens;
    }

    // POST api/Account/Token
    [AllowAnonymous]
    [EnableRateLimiting("login")]
    [HttpPost("Token")]
    public async Task<IActionResult> CreateToken(CreateTokenBindingModel model)
    {
        var user = await _userManager.FindByNameAsync(model.UserName);
        if (user == null)
            return BadRequest("User name or password is invalid.");

        // A locked account rejects even the right password until the lockout ends. The reply is
        // the same as for a wrong password so it does not reveal that the account exists.
        if (await _userManager.IsLockedOutAsync(user))
            return BadRequest("User name or password is invalid.");

        if (!await _userManager.CheckPasswordAsync(user, model.Password))
        {
            await _userManager.AccessFailedAsync(user);
            return BadRequest("User name or password is invalid.");
        }

        await _userManager.ResetAccessFailedCountAsync(user);

        var refreshToken = await _refreshTokens.StartSessionAsync(user.Id);
        SetRefreshCookie(refreshToken);
        return Ok(await CreateTokenResponseAsync(user));
    }

    // POST api/Account/Refresh
    // Trades the refresh cookie for a new access token and a rotated cookie.
    [AllowAnonymous]
    [EnableRateLimiting("refresh")]
    [HttpPost("Refresh")]
    public async Task<IActionResult> Refresh()
    {
        var rawToken = Request.Cookies[RefreshTokenService.CookieName];
        var refreshToken = string.IsNullOrEmpty(rawToken) ? null : await _refreshTokens.RotateAsync(rawToken);
        if (refreshToken == null)
        {
            DeleteRefreshCookie();
            return Unauthorized();
        }

        SetRefreshCookie(refreshToken);
        return Ok(await CreateTokenResponseAsync(refreshToken.User));
    }

    private async Task<CreateTokenViewModel> CreateTokenResponseAsync(ApplicationUser user)
    {
        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault();
        var profile = await GetProfileAsync(user.Id, role);
        var (token, expiresIn) = _tokenService.Create(user, roles);

        return new CreateTokenViewModel
        {
            AccessToken = token,
            TokenType = "bearer",
            ExpiresIn = expiresIn,
            UserName = user.UserName,
            Name = profile.Name,
            AccountId = user.Id,
            UserId = profile.UserId,
            Role = role,
        };
    }

    private void SetRefreshCookie(IssuedRefreshToken refreshToken) =>
        Response.Cookies.Append(
            RefreshTokenService.CookieName, refreshToken.RawToken, _refreshTokens.CookieOptionsFor(refreshToken.ExpiresAt));

    private void DeleteRefreshCookie() =>
        Response.Cookies.Delete(RefreshTokenService.CookieName, _refreshTokens.CookieOptionsFor(null));

    // GET api/Account/Info
    [HttpGet("Info")]
    public async Task<IActionResult> Info()
    {
        var user = await _userManager.FindByIdAsync(AccountId);
        if (user == null)
            return Unauthorized();

        var role = (await _userManager.GetRolesAsync(user)).FirstOrDefault();
        var profile = await GetProfileAsync(user.Id, role);

        return Ok(new InfoViewModel
        {
            AccountId = user.Id,
            Role = role,
            UserId = profile.UserId,
            Name = profile.Name,
            Email = profile.Email,
            Address = profile.Address,
            Identification = profile.Identification,
            Phone = profile.Phone,
        });
    }

    // POST api/Account/Logout
    // Open to anonymous callers so it still works once the access token has expired; the refresh
    // cookie is what identifies the session to end.
    [AllowAnonymous]
    [HttpPost("Logout")]
    public async Task<IActionResult> Logout()
    {
        var rawToken = Request.Cookies[RefreshTokenService.CookieName];
        if (!string.IsNullOrEmpty(rawToken))
            await _refreshTokens.RevokeAsync(rawToken);

        DeleteRefreshCookie();
        return Ok();
    }

    // POST api/Account/RenterRegister
    [AllowAnonymous]
    [HttpPost("RenterRegister")]
    public async Task<IActionResult> RenterRegister(RegisterBindingModel model)
    {
        return await RegisterAsync(model, RoleName.Renter, user =>
            _context.Renters.Add(new Renter { AccountId = user.Id, Name = model.Name, Email = model.Email }));
    }

    // POST api/Account/OwnerRegister
    [AllowAnonymous]
    [HttpPost("OwnerRegister")]
    public async Task<IActionResult> OwnerRegister(OwnerRegisterBindingModel model)
    {
        return await RegisterAsync(model, RoleName.WaitForConfirmation, user =>
            _context.Owners.Add(new Owner
            {
                AccountId = user.Id,
                Address = model.Address,
                Email = model.Email,
                Identification = model.Identification,
                Name = model.Name,
                Phone = model.Phone,
            }));
    }

    private async Task<IActionResult> RegisterAsync(
        RegisterBindingModel model, string role, Action<ApplicationUser> addProfile)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync();

        var user = new ApplicationUser { UserName = model.UserName, Email = model.Email };
        var result = await _userManager.CreateAsync(user, model.Password);
        if (!result.Succeeded)
            return IdentityErrors(result);

        var addToRole = await _userManager.AddToRoleAsync(user, role);
        if (!addToRole.Succeeded)
            return BadRequest("Error when add to role");

        addProfile(user);
        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return Ok();
    }

    private IActionResult IdentityErrors(IdentityResult result)
    {
        foreach (var error in result.Errors)
            ModelState.AddModelError(error.Code, error.Description);

        return BadRequest(ModelState);
    }

    private record Profile(
        int UserId, string Name, string Email, string Address, string Identification, string Phone);

    private async Task<Profile> GetProfileAsync(string accountId, string role)
    {
        switch (role)
        {
            case RoleName.Admin:
                var admin = await _context.Admins.SingleAsync(a => a.AccountId == accountId);
                return new Profile(admin.Id, admin.Name, admin.Email, null, null, null);

            case RoleName.WaitForConfirmation:
            case RoleName.Owner:
                var owner = await _context.Owners.SingleAsync(o => o.AccountId == accountId);
                return new Profile(owner.Id, owner.Name, owner.Email, owner.Address, owner.Identification, owner.Phone);

            case RoleName.Renter:
                var renter = await _context.Renters.SingleAsync(r => r.AccountId == accountId);
                return new Profile(renter.Id, renter.Name, renter.Email, null, null, null);

            default:
                return new Profile(0, null, null, null, null, null);
        }
    }
}
