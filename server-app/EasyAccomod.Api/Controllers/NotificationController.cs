using EasyAccomod.Api.Data;
using EasyAccomod.Api.Dtos;
using EasyAccomod.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EasyAccomod.Api.Controllers;

[Authorize(Roles = RoleName.Admin + ", " + RoleName.Owner)]
[Route("api/Notifications")]
public class NotificationController : ApiControllerBase
{
    private readonly ApplicationDbContext _context;

    public NotificationController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET api/Notifications
    [HttpGet("")]
    public async Task<IActionResult> GetNotification()
    {
        var accountId = AccountId;

        var notifications = await _context.Notifications
            .AsNoTracking()
            .Where(n => n.AccountId == accountId)
            .OrderByDescending(n => n.Id)
            .Take(10)
            .ToListAsync();

        return Ok(notifications);
    }

    // PUT api/Notifications/Check
    [HttpPut("Check")]
    public async Task<IActionResult> CheckNotification(NotificationId notificationId)
    {
        var accountId = AccountId;
        var notification = await _context.Notifications
            .SingleOrDefaultAsync(n => n.Id == notificationId.Id && n.AccountId == accountId);
        if (notification == null)
            return NotFound("Notification not found.");

        notification.HasBeenChecked = true;
        await _context.SaveChangesAsync();

        return Ok("Checked");
    }
}
