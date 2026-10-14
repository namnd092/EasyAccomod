using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace EasyAccomod.Api.Controllers;

[ApiController]
public abstract class ApiControllerBase : ControllerBase
{
    // Largest page a list endpoint serves; keeps one request from reading a whole table.
    public const int MaxPageSize = 100;

    protected string AccountId => User.FindFirstValue(ClaimTypes.NameIdentifier);

    // Returns a 400 result when the paging arguments are unusable, otherwise null.
    protected IActionResult ValidatePaging(int page, int limit)
    {
        if (page < 1)
            return BadRequest("Page must be at least 1.");

        if (limit < 1 || limit > MaxPageSize)
            return BadRequest($"Limit must be between 1 and {MaxPageSize}.");

        if ((long)(page - 1) * limit > int.MaxValue)
            return BadRequest("Page is out of range.");

        return null;
    }

    protected static int Offset(int page, int limit) => (page - 1) * limit;
}
