using EasyAccomod.Api.Data;
using EasyAccomod.Api.Dtos;
using EasyAccomod.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EasyAccomod.Api.Controllers;

[Authorize(Roles = RoleName.Admin)]
[Route("api/Admin")]
public class AdminController : ApiControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public AdminController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    // GET api/Admin/Owners
    [HttpGet("Owners")]
    public async Task<IActionResult> GetOwners(int _page = 1, int _limit = 15, int confirmationStatus = -1)
    {
        if (ValidatePaging(_page, _limit) is { } invalidPaging)
            return invalidPaging;

        IQueryable<Owner> owners = _context.Owners.AsNoTracking();

        switch (confirmationStatus)
        {
            case 1:
                // Owner has been approved
                var approvedOwnerAccounts = AccountsInRole(RoleName.Owner);
                owners = owners.Where(o => approvedOwnerAccounts.Contains(o.AccountId));
                break;

            case -1:
                // Owner are waiting for confirmation
                var pendingOwnerAccounts = AccountsInRole(RoleName.WaitForConfirmation);
                owners = owners.Where(o => pendingOwnerAccounts.Contains(o.AccountId));
                break;

            case 2:
                // Owner has permission to edit info
                owners = owners.Where(o => _context.EditInfoRequests.Any(r => r.OwnerId == o.Id && r.CanEditInfo));
                break;

            case -2:
                // Owner are waiting for permission to edit info
                owners = owners.Where(o => _context.EditInfoRequests.Any(r => r.OwnerId == o.Id && !r.CanEditInfo));
                break;

            case 0:
                // All Owner
                break;

            default:
                return BadRequest("Invalid input: confirmationStatus.");
        }

        var page = await owners
            .OrderBy(o => o.Id)
            .Skip(Offset(_page, _limit))
            .Take(_limit)
            .ToListAsync();

        return Ok(new ListOwnersDto
        {
            Owners = page.Select(o => o.ToDto()).ToList(),
            MaxPage = Mapping.MaxPage(await owners.CountAsync(), _limit),
        });
    }

    // POST api/Admin/SetOwner
    [HttpPost("SetOwner")]
    public async Task<IActionResult> SetOwner(SetRoleBindingModel model)
    {
        var user = await _userManager.FindByIdAsync(model.AccountId);
        if (user == null)
            return BadRequest("The user have account id " + model.AccountId + " does not exist.");

        if (!await _context.Owners.AnyAsync(o => o.AccountId == user.Id))
            return BadRequest("The user have account id " + model.AccountId + " is not an Owner.");

        var roles = await _userManager.GetRolesAsync(user);
        if (roles.Count > 0)
            await _userManager.RemoveFromRolesAsync(user, roles);
        await _userManager.AddToRoleAsync(user, RoleName.Owner);

        return Ok("Approved");
    }

    // POST api/Admin/RejectOwner
    [HttpPost("RejectOwner")]
    public async Task<IActionResult> RejectOwner(SetRoleBindingModel model)
    {
        var user = await _userManager.FindByIdAsync(model.AccountId);
        if (user == null)
            return BadRequest("The user have account id " + model.AccountId + " does not exist.");

        var owner = await _context.Owners.SingleOrDefaultAsync(o => o.AccountId == user.Id);
        if (owner == null)
            return BadRequest("The user have account id " + model.AccountId + " is not an Owner.");

        if (!await _userManager.IsInRoleAsync(user, RoleName.WaitForConfirmation))
            return BadRequest("User has been approved.");

        _context.Owners.Remove(owner);
        await _context.SaveChangesAsync();
        await _userManager.DeleteAsync(user);

        return Ok("Rejected");
    }

    // PUT api/Admin/RentalPost/SetStatus
    [HttpPut("RentalPost/SetStatus")]
    public async Task<IActionResult> SetRentalPostStatus(RentalPostStatusDto dto)
    {
        var rentalPostInDb = await _context.AccommodationRentalPosts
            .Include(p => p.Status)
            .Include(p => p.Accommodation.Owner)
            .SingleOrDefaultAsync(p => p.Id == dto.PostId);

        if (rentalPostInDb == null)
            return BadRequest("Post not found.");

        var status = await _context.RentalPostStatuses.SingleOrDefaultAsync(s => s.Id == dto.Id);
        if (status == null)
            return BadRequest("Status does not exist.");

        rentalPostInDb.StatusId = status.Id;

        string notificationContent = null;
        if (status.Name == RentalPostStatusName.Approved)
            notificationContent = "Bài viết \"" + rentalPostInDb.Title + "\" đã được Admin phê duyệt.";
        else if (status.Name == RentalPostStatusName.Rejected)
            notificationContent = "Bài viết \"" + rentalPostInDb.Title + "\" đã bị Admin từ chối phê duyệt.";

        if (notificationContent != null)
        {
            _context.Notifications.Add(new Notification
            {
                AccountId = rentalPostInDb.Accommodation.Owner.AccountId,
                Content = notificationContent,
                HasBeenChecked = false,
                Time = DateTime.UtcNow,
                RentalPostId = rentalPostInDb.Id,
            });
        }

        await _context.SaveChangesAsync();

        return Ok("Status: " + status.Name);
    }

    // GET api/Admin/RentalPosts
    [HttpGet("RentalPosts")]
    public async Task<IActionResult> SearchPostByStatus(int _page = 1, int _limit = 10, byte statusId = 0)
    {
        if (ValidatePaging(_page, _limit) is { } invalidPaging)
            return invalidPaging;

        IQueryable<AccommodationRentalPost> posts = _context.AccommodationRentalPosts
            .AsNoTracking()
            .Include(p => p.Accommodation.Owner)
            .Include(p => p.Status);

        if (statusId != 0)
        {
            if (!await _context.RentalPostStatuses.AnyAsync(s => s.Id == statusId))
                return BadRequest("Status does not exist.");

            posts = posts.Where(p => p.StatusId == statusId);
        }

        var page = await posts
            .OrderBy(p => p.Id)
            .Skip(Offset(_page, _limit))
            .Take(_limit)
            .ToListAsync();

        return Ok(new ListAdminSimplePost
        {
            MaxPage = Mapping.MaxPage(await posts.CountAsync(), _limit),
            SimplePostDtos = page.Select(p => p.ToAdminSimpleDto()).ToList(),
        });
    }

    // GET api/Admin/RentalPosts/ExtendPeriod
    [HttpGet("RentalPosts/ExtendPeriod")]
    public async Task<IActionResult> GetExtendPeriodPost(int _page = 1, int _limit = 10)
    {
        if (ValidatePaging(_page, _limit) is { } invalidPaging)
            return invalidPaging;

        var posts = _context.AccommodationRentalPosts
            .AsNoTracking()
            .Join(_context.ExtendRentalPostPeriods, p => p.Id, e => e.AccommodationRentalPostId, (p, e) => new
            {
                p.Id,
                p.Title,
                p.DateAdded,
                OwnerName = p.Accommodation.Owner.Name,
                OwnerEmail = p.Accommodation.Owner.Email,
                Status = p.Status.Name,
                e.ExtendPeriod,
                ExtendId = e.Id,
            });

        return Ok(new
        {
            MaxPage = Mapping.MaxPage(await posts.CountAsync(), _limit),
            ListPost = await posts.OrderBy(p => p.Id).Skip(Offset(_page, _limit)).Take(_limit).ToListAsync(),
        });
    }

    // POST api/Admin/RentalPost/ExtendPeriod/Approve
    [HttpPost("RentalPost/ExtendPeriod/Approve")]
    public async Task<IActionResult> ApproveExtend(ExtendId extendId)
    {
        var extend = await _context.ExtendRentalPostPeriods.SingleOrDefaultAsync(e => e.Id == extendId.Id);
        if (extend == null)
            return BadRequest("Extend request does not exits.");

        var post = await _context.AccommodationRentalPosts
            .SingleOrDefaultAsync(p => p.Id == extend.AccommodationRentalPostId);
        if (post == null)
            return BadRequest("Post not found.");

        post.DateExpired = post.DateExpired.AddDays(extend.ExtendPeriod);
        _context.ExtendRentalPostPeriods.Remove(extend);
        await _context.SaveChangesAsync();

        return Ok("Approved");
    }

    // POST api/Admin/RentalPost/ExtendPeriod/Reject
    [HttpPost("RentalPost/ExtendPeriod/Reject")]
    public async Task<IActionResult> RejectExtend(ExtendId extendId)
    {
        var extend = await _context.ExtendRentalPostPeriods.SingleOrDefaultAsync(e => e.Id == extendId.Id);
        if (extend == null)
            return BadRequest("Extend request does not exits.");

        _context.ExtendRentalPostPeriods.Remove(extend);
        await _context.SaveChangesAsync();

        return Ok("Rejected");
    }

    // GET api/Admin/PendingComment
    [HttpGet("PendingComment")]
    public async Task<IActionResult> GetPendingComment(int _page = 1, int _limit = 10)
    {
        if (ValidatePaging(_page, _limit) is { } invalidPaging)
            return invalidPaging;

        var comments = _context.Comments
            .AsNoTracking()
            .Where(c => !c.IsApproved);

        var page = await comments
            .Include(c => c.Renter)
            .OrderBy(c => c.Id)
            .Skip(Offset(_page, _limit))
            .Take(_limit)
            .ToListAsync();

        return Ok(new ListCommentsDto
        {
            MaxPage = Mapping.MaxPage(await comments.CountAsync(), _limit),
            ListCommentDtos = page.Select(c => c.ToDto()).ToList(),
        });
    }

    // POST api/Admin/ApproveComment
    [HttpPost("ApproveComment")]
    public async Task<IActionResult> ApproveComment(CommentId commentId)
    {
        var comment = await _context.Comments.SingleOrDefaultAsync(c => c.Id == commentId.Id);
        if (comment == null)
            return BadRequest("Comment does not exist.");

        if (comment.IsApproved)
            return BadRequest("Comment has been approved yet.");

        comment.IsApproved = true;
        await _context.SaveChangesAsync();

        return Ok("Approved");
    }

    // POST api/Admin/RejectComment
    [HttpPost("RejectComment")]
    public async Task<IActionResult> RejectComment(CommentId commentId)
    {
        var comment = await _context.Comments.SingleOrDefaultAsync(c => c.Id == commentId.Id);
        if (comment == null)
            return BadRequest("Comment does not exist.");

        if (comment.IsApproved)
            return BadRequest("Comment has been approved yet.");

        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync();

        return Ok("Rejected");
    }

    // GET api/Admin/RentalPost/Reports
    [HttpGet("RentalPost/Reports")]
    public async Task<IActionResult> GetReports(int _page = 1, int _limit = 10, bool isSolved = false)
    {
        if (ValidatePaging(_page, _limit) is { } invalidPaging)
            return invalidPaging;

        var reports = _context.Reports
            .AsNoTracking()
            .Where(r => r.IsSolved == isSolved);

        var page = await reports
            .Include(r => r.AccommodationRentalPost)
            .Include(r => r.Renter)
            .OrderBy(r => r.Id)
            .Skip(Offset(_page, _limit))
            .Take(_limit)
            .ToListAsync();

        return Ok(new ListReportsDto
        {
            MaxPage = Mapping.MaxPage(await reports.CountAsync(), _limit),
            Reports = page.Select(r => r.ToDto()).ToList(),
        });
    }

    // POST api/Admin/RentalPost/ResolveReport
    [HttpPost("RentalPost/ResolveReport")]
    public async Task<IActionResult> ResolveReport(ReportId reportId)
    {
        var report = await _context.Reports.SingleOrDefaultAsync(r => r.Id == reportId.Id);
        if (report == null)
            return BadRequest("Report not exist.");

        report.IsSolved = true;
        await _context.SaveChangesAsync();

        return Ok("Resolved");
    }

    // POST api/Admin/ResolveEditInfo
    [HttpPost("ResolveEditInfo")]
    public async Task<IActionResult> ResolveEditInfo(ResolveEditInfoBindingModel model)
    {
        var request = await _context.EditInfoRequests.SingleOrDefaultAsync(r => r.OwnerId == model.OwnerId);
        if (request == null)
            return BadRequest("Edit request doesn't exist.");

        if (model.CanEditInfo)
        {
            request.CanEditInfo = true;
            await _context.SaveChangesAsync();
            return Ok("Approved request");
        }

        _context.EditInfoRequests.Remove(request);
        await _context.SaveChangesAsync();

        return Ok("Rejected request");
    }

    // Account ids that hold the given role. Used as a subquery so owners are filtered in the database.
    private IQueryable<string> AccountsInRole(string roleName) =>
        from userRole in _context.UserRoles
        join role in _context.Roles on userRole.RoleId equals role.Id
        where role.Name == roleName
        select userRole.UserId;
}
