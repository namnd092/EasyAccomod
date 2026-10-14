using EasyAccomod.Api.Auth;
using EasyAccomod.Api.Data;
using EasyAccomod.Api.Dtos;
using EasyAccomod.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EasyAccomod.Api.Controllers;

[Authorize]
[Route("api/Account")]
public class AccountController : ApiControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly JwtTokenService _tokenService;

    public AccountController(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        JwtTokenService tokenService)
    {
        _context = context;
        _userManager = userManager;
        _tokenService = tokenService;
    }

    // POST api/Account/Token
    [AllowAnonymous]
    [HttpPost("Token")]
    public async Task<IActionResult> CreateToken(CreateTokenBindingModel model)
    {
        var user = await _userManager.FindByNameAsync(model.UserName);
        if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            return BadRequest("User name or password is invalid.");

        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault();
        var profile = await GetProfileAsync(user.Id, role);
        var (token, expiresIn) = _tokenService.Create(user, roles);

        return Ok(new CreateTokenViewModel
        {
            AccessToken = token,
            TokenType = "bearer",
            ExpiresIn = expiresIn,
            UserName = model.UserName,
            Name = profile.Name,
            AccountId = user.Id,
            UserId = profile.UserId,
            Role = role,
        });
    }

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
    [HttpPost("Logout")]
    public IActionResult Logout()
    {
        // Tokens are stateless; the client discards its token.
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
