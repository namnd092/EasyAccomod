using EasyAccomod.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EasyAccomod.Api.Controllers;

[AllowAnonymous]
[Route("api/Accommodations")]
public class AccommodationController : ApiControllerBase
{
    private readonly ApplicationDbContext _context;

    public AccommodationController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET api/Accommodations/Types
    [HttpGet("Types")]
    public async Task<IActionResult> GetAccommodationTypes() =>
        Ok(await _context.AccommodationTypes.AsNoTracking().ToListAsync());

    // GET api/Accommodations/PaymentTypes
    [HttpGet("PaymentTypes")]
    public async Task<IActionResult> GetAccommodationPaymentTypes() =>
        Ok(await _context.AccommodationPaymentTypes.AsNoTracking().ToListAsync());

    // GET api/Accommodations/KitchenTypes
    [HttpGet("KitchenTypes")]
    public async Task<IActionResult> GetAccommodationKitchenTypes() =>
        Ok(await _context.KitchenTypes.AsNoTracking().ToListAsync());

    // GET api/Accommodations/RoomAreaRanges
    [HttpGet("RoomAreaRanges")]
    public async Task<IActionResult> GetRoomAreaRanges() =>
        Ok(await _context.RoomAreaRanges.AsNoTracking().ToListAsync());

    // GET api/Accommodations/Statuses
    [HttpGet("Statuses")]
    public async Task<IActionResult> GetAccommodationStatuses() =>
        Ok(await _context.AccommodationStatuses.AsNoTracking().ToListAsync());
}
