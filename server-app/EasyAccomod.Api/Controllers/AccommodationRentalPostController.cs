using EasyAccomod.Api.Data;
using EasyAccomod.Api.Dtos;
using EasyAccomod.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EasyAccomod.Api.Controllers;

[Route("api/RentalPosts")]
public class AccommodationRentalPostController : ApiControllerBase
{
    private readonly ApplicationDbContext _context;

    public AccommodationRentalPostController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET /api/RentalPosts/Search
    [AllowAnonymous]
    [HttpGet("Search")]
    public async Task<IActionResult> SearchRentalPosts(
        int _page = 1, int _limit = 15,
        byte provinceId = 0, int districtId = 0, int wardId = 0, string street = "", string publicLocationNearby = "",
        byte paymentTypeId = 0, int minPrice = 0, int maxPrice = 0,
        byte accommodationTypeId = 0, byte roomAreaRangeId = 0,
        int liveWithOwner = 0, int haveClosedBathroom = 0, int haveWaterHeater = 0,
        byte kitchenTypeId = 0, int haveAirConditioner = 0, int haveBalcony = 0)
    {
        if (_page < 1)
            return BadRequest("Page must be at least 1.");

        var now = DateTime.UtcNow;
        var posts = _context.AccommodationRentalPosts
            .AsNoTracking()
            .Include(p => p.Accommodation.Address.Province)
            .Include(p => p.AccommodationPictures)
            .Include(p => p.Accommodation.PaymentType)
            .Include(p => p.Accommodation.RoomAreaRange)
            .Where(p => p.DateExpired > now && p.Status.Name == RentalPostStatusName.Approved);

        // Search by Address
        if (wardId != 0)
            posts = posts.Where(p => p.Accommodation.Address.WardId == wardId);
        else if (districtId != 0)
            posts = posts.Where(p => p.Accommodation.Address.DistrictId == districtId);
        else if (provinceId != 0)
            posts = posts.Where(p => p.Accommodation.Address.ProvinceId == provinceId);
        if (!string.IsNullOrWhiteSpace(street))
            posts = posts.Where(p => EF.Functions.ILike(p.Accommodation.Address.Street, "%" + street + "%"));
        if (!string.IsNullOrWhiteSpace(publicLocationNearby))
            posts = posts.Where(p =>
                EF.Functions.ILike(p.Accommodation.Address.PublicLocationNearby, "%" + publicLocationNearby + "%"));

        // Search by Price
        if (paymentTypeId != 0)
        {
            posts = posts.Where(p => p.Accommodation.PaymentTypeId == paymentTypeId);
            if (minPrice != 0)
                posts = posts.Where(p => p.Accommodation.Price >= minPrice);
            if (maxPrice != 0)
                posts = posts.Where(p => p.Accommodation.Price <= maxPrice);
        }

        if (accommodationTypeId != 0)
            posts = posts.Where(p => p.Accommodation.AccommodationTypeId == accommodationTypeId);

        if (roomAreaRangeId != 0)
            posts = posts.Where(p => p.Accommodation.RoomAreaRangeId == roomAreaRangeId);

        // Search by Accommodation facilities: 1 = must have, -1 = must not have, 0 = ignore
        if (!IsTriState(haveAirConditioner)) return BadRequest("Invalid input: haveAirConditioner.");
        if (haveAirConditioner != 0)
            posts = posts.Where(p => p.Accommodation.HaveAirConditioner == (haveAirConditioner == 1));

        if (!IsTriState(haveBalcony)) return BadRequest("Invalid input: haveBalcony.");
        if (haveBalcony != 0)
            posts = posts.Where(p => p.Accommodation.HaveBalcony == (haveBalcony == 1));

        if (!IsTriState(haveClosedBathroom)) return BadRequest("Invalid input: haveCloseBathroom.");
        if (haveClosedBathroom != 0)
            posts = posts.Where(p => p.Accommodation.HaveClosedBathroom == (haveClosedBathroom == 1));

        if (!IsTriState(haveWaterHeater)) return BadRequest("Invalid input: haveWaterHeater.");
        if (haveWaterHeater != 0)
            posts = posts.Where(p => p.Accommodation.HaveWaterHeater == (haveWaterHeater == 1));

        if (!IsTriState(liveWithOwner)) return BadRequest("Invalid input: liveWithOwner");
        if (liveWithOwner != 0)
            posts = posts.Where(p => p.Accommodation.LiveWithOwner == (liveWithOwner == 1));

        if (kitchenTypeId != 0)
            posts = posts.Where(p => p.Accommodation.KitchenTypeId == kitchenTypeId);

        // Page and limit result
        // No matches is a normal answer (an empty first page); only a page past the end is not found.
        var maxPage = Mapping.MaxPage(await posts.CountAsync(), _limit);
        if (_page > Math.Max(maxPage, 1))
            return NotFound();

        var pagePosts = await posts
            .OrderBy(p => p.Id)
            .Skip(_limit * (_page - 1))
            .Take(_limit)
            .ToListAsync();

        var rates = await GetRatesAsync(pagePosts.Select(p => p.Id).ToList());
        var simplePostDtos = pagePosts.Select(p =>
        {
            var dto = p.ToSimpleDto();
            dto.Rate = rates.GetValueOrDefault(p.Id);
            return dto;
        }).ToList();

        return Ok(new ListSimplePost { SimplePostDtos = simplePostDtos, MaxPage = maxPage });
    }

    // GET /api/RentalPosts/Get/1
    [AllowAnonymous]
    [HttpGet("Get/{id}")]
    public async Task<IActionResult> GetRentalPost(int id)
    {
        var rentalPost = await _context.AccommodationRentalPosts
            .Include(p => p.Accommodation.Address.Ward.District.Province)
            .Include(p => p.AccommodationPictures)
            .Include(p => p.Status)
            .Include(p => p.Accommodation.Owner)
            .Include(p => p.Accommodation.AccommodationType)
            .Include(p => p.Accommodation.KitchenType)
            .Include(p => p.Accommodation.PaymentType)
            .Include(p => p.Accommodation.RoomAreaRange)
            .Include(p => p.Accommodation.Status)
            .SingleOrDefaultAsync(r => r.Id == id);

        if (rentalPost == null)
            return NotFound();

        if (rentalPost.DateExpired < DateTime.UtcNow || rentalPost.Status.Name != RentalPostStatusName.Approved)
        {
            if (User.IsInRole(RoleName.Owner))
            {
                if (rentalPost.Accommodation.Owner.AccountId != AccountId)
                    return NotFound();
            }
            else if (!User.IsInRole(RoleName.Admin))
                return NotFound();
        }

        var rentalPostDto = rentalPost.ToDto();
        rentalPostDto.Accommodation.Owner.Identification = null;
        rentalPostDto.Accommodation.Owner.Address = null;
        rentalPostDto.Accommodation.Owner.AccountId = null;
        rentalPostDto.Rate = (await GetRatesAsync(new List<int> { id })).GetValueOrDefault(id);

        _context.Views.Add(new View { AccommodationRentalPostId = id, Time = DateTime.UtcNow });
        await _context.SaveChangesAsync();

        return Ok(rentalPostDto);
    }

    // POST /api/RentalPosts
    [Authorize(Roles = RoleName.Owner + ", " + RoleName.Admin)]
    [HttpPost("")]
    public async Task<IActionResult> AddRentalPost(AccommodationRentalPostDto dto)
    {
        if (dto.AccommodationPictures.Count < 3)
            return BadRequest("Please upload at least 3 pictures.");

        if (User.IsInRole(RoleName.Admin))
        {
            var ownerId = dto.Accommodation.OwnerId;
            if (ownerId <= 0)
                return BadRequest("OwnerId is required.");
            if (!await _context.Owners.AnyAsync(o => o.Id == ownerId))
                return BadRequest("The Owner does not exist.");
        }

        if (!await AddressExistsAsync(dto.Accommodation.Address))
            return BadRequest("Address does not exist.");

        var now = DateTime.UtcNow;
        var accommodation = NewAccommodation(dto.Accommodation);
        accommodation.StatusId = await _context.AccommodationStatuses
            .Where(s => s.Name == AccommodationStatusName.NotRented).Select(s => s.Id).SingleAsync();

        byte postStatusId;
        if (User.IsInRole(RoleName.Owner))
        {
            postStatusId = await _context.RentalPostStatuses
                .Where(s => s.Name == RentalPostStatusName.PendingApproval).Select(s => s.Id).SingleAsync();

            var accountId = AccountId;
            accommodation.OwnerId = await _context.Owners
                .Where(o => o.AccountId == accountId).Select(o => o.Id).SingleAsync();
        }
        else
        {
            postStatusId = await _context.RentalPostStatuses
                .Where(s => s.Name == RentalPostStatusName.Approved).Select(s => s.Id).SingleAsync();
            accommodation.OwnerId = dto.Accommodation.OwnerId;
        }

        var rentalPost = new AccommodationRentalPost
        {
            Title = dto.Title,
            Content = dto.Content,
            DateAdded = now,
            DateExpired = now.AddDays(dto.TimeDisplayed.Value),
            StatusId = postStatusId,
            Accommodation = accommodation,
            AccommodationPictures = dto.AccommodationPictures
                .Select(p => new AccommodationPicture { PictureLink = p.PictureLink })
                .ToList(),
        };

        _context.AccommodationRentalPosts.Add(rentalPost);
        await _context.SaveChangesAsync();

        return Created($"{Request.Path}/{rentalPost.Id}", rentalPost.ToDto());
    }

    // PUT /api/RentalPosts/Edit/1
    [Authorize(Roles = RoleName.Owner + ", " + RoleName.Admin)]
    [HttpPut("Edit/{id}")]
    public async Task<IActionResult> EditRentalPost(int id, EditPostDto dto)
    {
        if (dto.AccommodationPictures.Count < 3)
            return BadRequest("Please upload at least 3 picture.");

        if (!await AddressExistsAsync(dto.Accommodation.Address))
            return BadRequest("Address does not exist.");

        var rentalPostInDb = await _context.AccommodationRentalPosts
            .Include(p => p.Status)
            .Include(p => p.Accommodation.Address)
            .Include(p => p.Accommodation.Owner)
            .Include(p => p.AccommodationPictures)
            .SingleOrDefaultAsync(p => p.Id == id);

        if (rentalPostInDb == null)
            return BadRequest("Post not found.");

        if (!User.IsInRole(RoleName.Admin) && rentalPostInDb.Accommodation.Owner.AccountId != AccountId)
            return Forbid();

        if (rentalPostInDb.Status.Name != RentalPostStatusName.PendingApproval)
            return BadRequest("Can not edit post. Post status: " + rentalPostInDb.Status.Name);

        rentalPostInDb.Title = dto.Title;
        rentalPostInDb.Content = dto.Content;

        _context.AccommodationPictures.RemoveRange(rentalPostInDb.AccommodationPictures);
        foreach (var picture in dto.AccommodationPictures)
        {
            _context.AccommodationPictures.Add(
                new AccommodationPicture { PictureLink = picture.PictureLink, AccommodationRentalPostId = id });
        }

        // Update the existing accommodation and address in place (status, address id and owner are kept).
        var accommodation = rentalPostInDb.Accommodation;
        var edited = dto.Accommodation;
        accommodation.AccommodationTypeId = edited.AccommodationTypeId.Value;
        accommodation.RoomQuantity = edited.RoomQuantity.Value;
        accommodation.PaymentTypeId = edited.PaymentTypeId.Value;
        accommodation.Price = edited.Price.Value;
        accommodation.RoomAreaRangeId = edited.RoomAreaRangeId.Value;
        accommodation.LiveWithOwner = edited.LiveWithOwner.Value;
        accommodation.HaveClosedBathroom = edited.HaveClosedBathroom.Value;
        accommodation.HaveWaterHeater = edited.HaveWaterHeater.Value;
        accommodation.KitchenTypeId = edited.KitchenTypeId.Value;
        accommodation.HaveAirConditioner = edited.HaveAirConditioner.Value;
        accommodation.HaveBalcony = edited.HaveBalcony.Value;
        accommodation.IsStateElectricityPrice = edited.IsStateElectricityPrice.Value;
        accommodation.ElectricityPrice = edited.ElectricityPrice;
        accommodation.IsStateWaterPrice = edited.IsStateWaterPrice.Value;
        accommodation.WaterPrice = edited.WaterPrice;
        accommodation.RoomOptions = edited.RoomOptions;
        accommodation.Address.ProvinceId = edited.Address.ProvinceId.Value;
        accommodation.Address.DistrictId = edited.Address.DistrictId.Value;
        accommodation.Address.WardId = edited.Address.WardId.Value;
        accommodation.Address.Street = edited.Address.Street;
        accommodation.Address.PublicLocationNearby = edited.Address.PublicLocationNearby;

        if (User.IsInRole(RoleName.Admin))
        {
            rentalPostInDb.StatusId = await _context.RentalPostStatuses
                .Where(s => s.Name == RentalPostStatusName.Approved).Select(s => s.Id).SingleAsync();
        }

        await _context.SaveChangesAsync();

        return Ok("Post has been edited.");
    }

    // GET api/RentalPosts/Fee
    [Authorize(Roles = RoleName.Admin + ", " + RoleName.Owner)]
    [HttpGet("Fee")]
    public IActionResult GetPostFee(int timeDisplayed)
    {
        if (timeDisplayed < 7 || timeDisplayed > 365)
            return BadRequest("Time to display post should be between 7 to 365 days.");

        return Ok(timeDisplayed * 5000);
    }

    // GET api/RentalPosts/1/Views
    [AllowAnonymous]
    [HttpGet("{id}/Views")]
    public async Task<IActionResult> GetViews(int id)
    {
        if (!await _context.AccommodationRentalPosts.AnyAsync(p => p.Id == id))
            return BadRequest("Post does not exist.");

        return Ok(await _context.Views.CountAsync(v => v.AccommodationRentalPostId == id));
    }

    // GET api/RentalPosts/1/Likes
    [AllowAnonymous]
    [HttpGet("{id}/Likes")]
    public async Task<IActionResult> GetLikes(int id)
    {
        if (!await _context.AccommodationRentalPosts.AnyAsync(p => p.Id == id))
            return BadRequest("Post does not exist.");

        return Ok(await _context.Likes.CountAsync(l => l.AccommodationRentalPostId == id));
    }

    // GET api/RentalPosts/1/Comments
    [AllowAnonymous]
    [HttpGet("{id}/Comments")]
    public async Task<IActionResult> GetComments(int id, int _page = 1, int _limit = 10)
    {
        if (_page < 1)
            return BadRequest("Page must be at least 1.");

        if (!await _context.AccommodationRentalPosts.AnyAsync(p => p.Id == id))
            return BadRequest("Post does not exist.");

        var comments = _context.Comments
            .AsNoTracking()
            .Include(c => c.Renter)
            .Where(c => c.AccommodationRentalPostId == id && c.IsApproved);

        var maxPage = Mapping.MaxPage(await comments.CountAsync(), _limit);
        if (_page > maxPage)
            return NotFound();

        var page = await comments
            .OrderBy(c => c.Id)
            .Skip(_limit * (_page - 1))
            .Take(_limit)
            .ToListAsync();

        return Ok(new ListCommentsDto { ListCommentDtos = page.Select(c => c.ToDto()).ToList(), MaxPage = maxPage });
    }

    // GET api/RentalPosts/Statuses
    [AllowAnonymous]
    [HttpGet("Statuses")]
    public async Task<IActionResult> GetPostStatuses() =>
        Ok(await _context.RentalPostStatuses.AsNoTracking().ToListAsync());

    private static bool IsTriState(int value) => value is -1 or 0 or 1;

    private async Task<Dictionary<int, double>> GetRatesAsync(List<int> postIds)
    {
        return await _context.Comments
            .Where(c => c.IsApproved && postIds.Contains(c.AccommodationRentalPostId))
            .GroupBy(c => c.AccommodationRentalPostId)
            .Select(g => new { PostId = g.Key, Rate = g.Average(c => (double)c.Rate) })
            .ToDictionaryAsync(x => x.PostId, x => x.Rate);
    }

    private async Task<bool> AddressExistsAsync(AddressDto address)
    {
        var ward = await _context.Wards
            .Include(w => w.District)
            .SingleOrDefaultAsync(w => w.Id == address.WardId);

        return ward != null
               && ward.DistrictId == address.DistrictId
               && ward.District.ProvinceId == address.ProvinceId;
    }

    private static Accommodation NewAccommodation(AccommodationDto dto) => new Accommodation
    {
        Address = new Address
        {
            ProvinceId = dto.Address.ProvinceId.Value,
            DistrictId = dto.Address.DistrictId.Value,
            WardId = dto.Address.WardId.Value,
            Street = dto.Address.Street,
            PublicLocationNearby = dto.Address.PublicLocationNearby,
        },
        AccommodationTypeId = dto.AccommodationTypeId.Value,
        RoomQuantity = dto.RoomQuantity.Value,
        PaymentTypeId = dto.PaymentTypeId.Value,
        Price = dto.Price.Value,
        RoomAreaRangeId = dto.RoomAreaRangeId.Value,
        LiveWithOwner = dto.LiveWithOwner.Value,
        HaveClosedBathroom = dto.HaveClosedBathroom.Value,
        HaveWaterHeater = dto.HaveWaterHeater.Value,
        KitchenTypeId = dto.KitchenTypeId.Value,
        HaveAirConditioner = dto.HaveAirConditioner.Value,
        HaveBalcony = dto.HaveBalcony.Value,
        IsStateElectricityPrice = dto.IsStateElectricityPrice.Value,
        ElectricityPrice = dto.ElectricityPrice,
        IsStateWaterPrice = dto.IsStateWaterPrice.Value,
        WaterPrice = dto.WaterPrice,
        RoomOptions = dto.RoomOptions,
    };
}
