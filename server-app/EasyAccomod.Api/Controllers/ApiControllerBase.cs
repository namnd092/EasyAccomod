using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace EasyAccomod.Api.Controllers;

[ApiController]
public abstract class ApiControllerBase : ControllerBase
{
    protected string AccountId => User.FindFirstValue(ClaimTypes.NameIdentifier);
}
