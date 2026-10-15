using EasyAccomod.Api.Data;
using EasyAccomod.Api.Dtos;
using EasyAccomod.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EasyAccomod.Api.Controllers;

[Authorize(Roles = RoleName.Renter)]
[Route("api/Renter")]
public class RenterController : ApiControllerBase
{
    private readonly ApplicationDbContext _context;

    public RenterController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET api/Renter/RentalPost/Likes
    [HttpGet("RentalPost/Likes")]
    public async Task<IActionResult> GetLikedPost(int _page = 1, int _limit = 15)
    {
        if (ValidatePaging(_page, _limit) is { } invalidPaging)
            return invalidPaging;

        var renterId = await GetRenterIdAsync();
        var now = DateTime.UtcNow;

        var likedPosts = _context.AccommodationRentalPosts
            .AsNoTracking()
            .Include(p => p.Status)
            .Include(p => p.AccommodationPictures)
            .Include(p => p.Accommodation.Address.Province)
            .Include(p => p.Accommodation.PaymentType)
            .Include(p => p.Accommodation.RoomAreaRange)
            .Where(p => _context.Likes.Any(l => l.AccommodationRentalPostId == p.Id && l.RenterId == renterId))
            .Where(p => p.DateExpired > now && p.Status.Name == RentalPostStatusName.Approved);

        var maxPage = Mapping.MaxPage(await likedPosts.CountAsync(), _limit);
        // The first page always exists, even when nothing is liked.
        if (_page > Math.Max(maxPage, 1))
            return NotFound();

        var page = await likedPosts
            .OrderBy(p => p.Id)
            .Skip(Offset(_page, _limit))
            .Take(_limit)
            .ToListAsync();

        return Ok(new ListSimplePost { SimplePostDtos = page.Select(p => p.ToSimpleDto()).ToList(), MaxPage = maxPage });
    }

    // POST api/Renter/RentalPost/Like
    [HttpPost("RentalPost/Like")]
    public async Task<IActionResult> Like(LikeDto likeDto)
    {
        var post = await _context.AccommodationRentalPosts
            .Include(p => p.Status)
            .SingleOrDefaultAsync(p => p.Id == likeDto.AccommodationRentalPostId);

        if (post == null || post.Status.Name != RentalPostStatusName.Approved || post.DateExpired < DateTime.UtcNow)
            return BadRequest("Post does not exist.");

        var renterId = await GetRenterIdAsync();

        // Liking an already liked post removes the like.
        var likeInDb = await _context.Likes.SingleOrDefaultAsync(l =>
            l.AccommodationRentalPostId == likeDto.AccommodationRentalPostId && l.RenterId == renterId);

        if (likeInDb != null)
        {
            _context.Likes.Remove(likeInDb);
            await _context.SaveChangesAsync();
            return Ok("Dislike");
        }

        _context.Likes.Add(new Like
        {
            AccommodationRentalPostId = likeDto.AccommodationRentalPostId.Value,
            RenterId = renterId,
            Time = DateTime.UtcNow,
        });
        await _context.SaveChangesAsync();

        return Ok("Like");
    }

    // POST api/Renter/RentalPost/Comment
    [HttpPost("RentalPost/Comment")]
    public async Task<IActionResult> Comment(CommentDto commentDto)
    {
        if (!await IsPublishedPostAsync(commentDto.AccommodationRentalPostId))
            return BadRequest("Post does not exist.");

        var renterId = await GetRenterIdAsync();
        if (await _context.Comments.AnyAsync(c =>
                c.RenterId == renterId && c.AccommodationRentalPostId == commentDto.AccommodationRentalPostId))
            return BadRequest("Each Renter should be comment only 1 time.");

        _context.Comments.Add(new Comment
        {
            RenterId = renterId,
            AccommodationRentalPostId = commentDto.AccommodationRentalPostId.Value,
            Rate = commentDto.Rate.Value,
            Content = commentDto.Content,
            IsApproved = false,
            Time = DateTime.UtcNow,
        });
        await _context.SaveChangesAsync();

        return Ok();
    }

    // POST api/Renter/RentalPost/Report
    [HttpPost("RentalPost/Report")]
    public async Task<IActionResult> Report(ReportDto reportDto)
    {
        if (!await IsPublishedPostAsync(reportDto.AccommodationRentalPostId))
            return BadRequest("Post does not exist.");

        var renterId = await GetRenterIdAsync();
        if (await _context.Reports.AnyAsync(r =>
                r.RenterId == renterId && r.AccommodationRentalPostId == reportDto.AccommodationRentalPostId))
            return BadRequest("Each Renter should be report only 1 time.");

        _context.Reports.Add(new Report
        {
            RenterId = renterId,
            AccommodationRentalPostId = reportDto.AccommodationRentalPostId.Value,
            Content = reportDto.Content,
            IsSolved = false,
            Time = DateTime.UtcNow,
        });
        await _context.SaveChangesAsync();

        return Ok("Reported");
    }

    // GET api/Renter/RentalPost/IsLiked
    [HttpGet("RentalPost/IsLiked")]
    public async Task<IActionResult> GetLikeStatus(int postId = 0)
    {
        if (!await _context.AccommodationRentalPosts.AnyAsync(p => p.Id == postId))
            return BadRequest("Post does not exist.");

        var renterId = await GetRenterIdAsync();
        var result = await _context.Likes.AnyAsync(l => l.RenterId == renterId && l.AccommodationRentalPostId == postId);

        return Ok(new { result });
    }

    // GET api/Renter/RentalPost/IsCommented
    [HttpGet("RentalPost/IsCommented")]
    public async Task<IActionResult> GetCommentStatus(int postId = 0)
    {
        if (!await _context.AccommodationRentalPosts.AnyAsync(p => p.Id == postId))
            return BadRequest("Post does not exist.");

        var renterId = await GetRenterIdAsync();
        var result = await _context.Comments.AnyAsync(c => c.RenterId == renterId && c.AccommodationRentalPostId == postId);

        return Ok(new { result });
    }

    // GET api/Renter/RentalPost/IsReported
    [HttpGet("RentalPost/IsReported")]
    public async Task<IActionResult> GetReportStatus(int postId = 0)
    {
        if (!await _context.AccommodationRentalPosts.AnyAsync(p => p.Id == postId))
            return BadRequest("Post does not exist.");

        var renterId = await GetRenterIdAsync();
        var result = await _context.Reports.AnyAsync(r => r.RenterId == renterId && r.AccommodationRentalPostId == postId);

        return Ok(new { result });
    }

    // Renters can only interact with posts that are publicly visible (approved and not expired).
    private async Task<bool> IsPublishedPostAsync(int? postId)
    {
        var now = DateTime.UtcNow;
        return await _context.AccommodationRentalPosts.AnyAsync(p =>
            p.Id == postId && p.Status.Name == RentalPostStatusName.Approved && p.DateExpired > now);
    }

    private async Task<int> GetRenterIdAsync()
    {
        var accountId = AccountId;
        return await _context.Renters.Where(r => r.AccountId == accountId).Select(r => r.Id).SingleAsync();
    }
}
