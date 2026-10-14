using EasyAccomod.Api.Data;
using EasyAccomod.Api.Dtos;
using EasyAccomod.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EasyAccomod.Api.Controllers;

[Authorize(Roles = RoleName.Owner)]
[Route("api/Owner")]
public class OwnerController : ApiControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public OwnerController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    // GET api/Owner/RentalPosts
    [HttpGet("RentalPosts")]
    public async Task<IActionResult> GetRentalPost(
        int _page = 1, int _limit = 15, byte statusId = 0, int isExpired = 0, int wasRented = 0)
    {
        if (ValidatePaging(_page, _limit) is { } invalidPaging)
            return invalidPaging;

        var accountId = AccountId;
        var now = DateTime.UtcNow;
        var posts = _context.AccommodationRentalPosts
            .AsNoTracking()
            .Include(p => p.Status)
            .Include(p => p.Accommodation.Address.Province)
            .Include(p => p.Accommodation.Address.District)
            .Include(p => p.Accommodation.Address.Ward.District.Province)
            .Include(p => p.Accommodation.Status)
            .Where(p => p.Accommodation.Owner.AccountId == accountId);

        if (statusId != 0)
            posts = posts.Where(p => p.StatusId == statusId);

        switch (isExpired)
        {
            case 1:
                posts = posts.Where(p => p.DateExpired < now);
                break;
            case -1:
                posts = posts.Where(p => p.DateExpired > now);
                break;
            case 0:
                break;
            default:
                return BadRequest("Invalid input: isExpired.");
        }

        switch (wasRented)
        {
            case 1:
                posts = posts.Where(p => p.Accommodation.Status.Name == AccommodationStatusName.Rented);
                break;
            case -1:
                posts = posts.Where(p => p.Accommodation.Status.Name == AccommodationStatusName.NotRented);
                break;
            case 0:
                break;
            default:
                return BadRequest("Invalid input: wasRented.");
        }

        var page = await posts
            .OrderBy(p => p.Id)
            .Skip(Offset(_page, _limit))
            .Take(_limit)
            .ToListAsync();

        var dtos = page.Select(p => p.ToOwnerSimpleDto()).ToList();
        foreach (var dto in dtos)
        {
            dto.Likes = await _context.Likes.CountAsync(l => l.AccommodationRentalPostId == dto.Id);
            dto.Views = await _context.Views.CountAsync(v => v.AccommodationRentalPostId == dto.Id);
        }

        return Ok(new ListOwnerSimplePost
        {
            MaxPage = Mapping.MaxPage(await posts.CountAsync(), _limit),
            OwnerSimplePostDtos = dtos,
        });
    }

    // PUT api/Owner/Accommodation/SetStatus
    [HttpPut("Accommodation/SetStatus")]
    public async Task<IActionResult> SetAccommodationStatus(SetAccommodationStatusDto dto)
    {
        var accommodation = await _context.Accommodations
            .Include(a => a.Owner)
            .SingleOrDefaultAsync(a => a.Id == dto.AccommodationId);

        if (accommodation == null)
            return BadRequest("Accommodation does not exist.");

        if (accommodation.Owner.AccountId != AccountId)
            return BadRequest("You do not have permission to edit this accommodation.");

        var wasRented = dto.WasRented.Value;
        var newStatusName = wasRented ? AccommodationStatusName.Rented : AccommodationStatusName.NotRented;
        var newStatus = await _context.AccommodationStatuses.SingleAsync(s => s.Name == newStatusName);

        accommodation.StatusId = newStatus.Id;

        _context.Notifications.Add(new Notification
        {
            AccountId = (await _context.Admins.OrderBy(a => a.Id).FirstAsync()).AccountId,
            HasBeenChecked = false,
            RentalPostId = await _context.AccommodationRentalPosts
                .Where(p => p.AccommodationId == accommodation.Id)
                .Select(p => p.Id)
                .FirstAsync(),
            Time = DateTime.UtcNow,
            Content = accommodation.Owner.Name + (wasRented
                ? " đã cập nhật trạng thái phòng trọ thành đã cho thuê."
                : " đã cập nhật trạng thái phòng trọ thành chưa cho thuê."),
        });
        await _context.SaveChangesAsync();

        return Ok("Accommodation status: " + newStatus.Name);
    }

    // POST api/Owner/RentalPosts/ExtendPeriod
    [HttpPost("RentalPosts/ExtendPeriod")]
    public async Task<IActionResult> ExtendRentalPostPeriod(ExtendRentalPostPeriodDto dto)
    {
        if (await _context.ExtendRentalPostPeriods.AnyAsync(e => e.AccommodationRentalPostId == dto.AccommodationRentalPostId))
            return BadRequest("Please wait until the previous request has been resolved.");

        var rentalPost = await _context.AccommodationRentalPosts
            .Include(p => p.Accommodation.Owner)
            .SingleOrDefaultAsync(p => p.Id == dto.AccommodationRentalPostId);

        if (rentalPost == null)
            return BadRequest("Post does not exist.");

        if (rentalPost.Accommodation.Owner.AccountId != AccountId)
            return BadRequest("You don't have permission with this post.");

        _context.ExtendRentalPostPeriods.Add(new ExtendRentalPostPeriod
        {
            AccommodationRentalPostId = dto.AccommodationRentalPostId.Value,
            ExtendPeriod = dto.ExtendPeriod.Value,
        });
        await _context.SaveChangesAsync();

        return Ok();
    }

    // GET api/Owner/EditInfoStatus
    [HttpGet("EditInfoStatus")]
    public async Task<IActionResult> EditInfoStatus()
    {
        var accountId = AccountId;
        var ownerId = await _context.Owners.Where(o => o.AccountId == accountId).Select(o => o.Id).SingleAsync();

        var request = await _context.EditInfoRequests.SingleOrDefaultAsync(r => r.OwnerId == ownerId);
        var result = request == null ? -1 : (request.CanEditInfo ? 1 : 0);

        return Ok(new { result });
    }

    // POST api/Owner/RequireEditInfo
    [HttpPost("RequireEditInfo")]
    public async Task<IActionResult> RequireEditInfo()
    {
        var accountId = AccountId;
        var ownerId = await _context.Owners.Where(o => o.AccountId == accountId).Select(o => o.Id).SingleAsync();

        if (await _context.EditInfoRequests.AnyAsync(r => r.OwnerId == ownerId))
            return BadRequest("You has been required edit info yet.");

        _context.EditInfoRequests.Add(new EditInfoRequest { OwnerId = ownerId, CanEditInfo = false });
        await _context.SaveChangesAsync();

        return Ok("Required");
    }

    // PUT api/Owner/EditInfo
    [HttpPut("EditInfo")]
    public async Task<IActionResult> EditInfo(OwnerDto ownerDto)
    {
        var accountId = AccountId;
        var owner = await _context.Owners.SingleAsync(o => o.AccountId == accountId);

        var request = await _context.EditInfoRequests.SingleOrDefaultAsync(r => r.OwnerId == owner.Id);
        if (request == null)
            return BadRequest("You need require edit info permission from Admin first.");

        if (!request.CanEditInfo)
            return BadRequest("Wait until Admin approved your edit request.");

        // Id and AccountId are never taken from the request body.
        owner.Name = ownerDto.Name;
        owner.Identification = ownerDto.Identification;
        owner.Address = ownerDto.Address;
        owner.Phone = ownerDto.Phone;
        owner.Email = ownerDto.Email;

        var user = await _userManager.FindByIdAsync(accountId);
        await _userManager.RemoveFromRoleAsync(user, RoleName.Owner);
        await _userManager.AddToRoleAsync(user, RoleName.WaitForConfirmation);

        _context.EditInfoRequests.Remove(request);
        await _context.SaveChangesAsync();

        return Ok("Edited info");
    }
}
