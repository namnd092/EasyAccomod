using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Http;
using AutoMapper;
using EasyAccomod.Dtos;
using EasyAccomod.Models;
using Microsoft.Ajax.Utilities;
using Microsoft.AspNet.Identity;

namespace EasyAccomod.Controllers
{
    [RoutePrefix("api/RentalPosts")]
    public class AccommodationRentalPostController : ApiController
    {
        private readonly ApplicationDbContext _context;

        public AccommodationRentalPostController()
        {
            _context = new ApplicationDbContext();
        }

        // GET	/api/RentalPosts/Search
        [HttpGet]
        [Route("Search")]
        public IHttpActionResult SearchRentalPosts(int _page = 1, int _limit = 15
            , byte provinceId = 0, int districtId = 0, int wardId = 0, string street = "", string publicLocationNearby = ""
            , byte paymentTypeId = 0, int minPrice = 0, int maxPrice = 0
            , byte accommodationTypeId = 0, byte roomAreaRangeId = 0
            , int liveWithOwner = 0, int haveClosedBathroom = 0, int haveWaterHeater = 0
            , byte kitchenTypeId = 0, int haveAirConditioner = 0, int haveBalcony = 0)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (_page < 1)
                return BadRequest("Page must be at least 1.");

            if (_page > Math.Ceiling(1.0 * _context.AccommodationRentalPosts.Count() / _limit))
                return NotFound();

            var rentalPostsInDb = _context.AccommodationRentalPosts
                .Include(p => p.Accommodation.Address.Province)
                .Include(p => p.AccommodationPictures)
                .Include(p => p.Accommodation.PaymentType)
                .Include(p => p.Accommodation.RoomAreaRange);

            // Don't show expired post
            rentalPostsInDb = rentalPostsInDb
                .Where(p => p.DateExpired > DateTime.Now && p.Status.Name == RentalPostStatusName.Approved);

            // Search by Address
            if (wardId != 0)
                rentalPostsInDb = rentalPostsInDb.Where(p => p.Accommodation.Address.WardId == wardId);
            else if (districtId != 0)
                rentalPostsInDb = rentalPostsInDb.Where(p => p.Accommodation.Address.DistrictId == districtId);
            else if (provinceId != 0)
                rentalPostsInDb = rentalPostsInDb.Where(p => p.Accommodation.Address.ProvinceId == provinceId);
            if (!street.IsNullOrWhiteSpace())
                rentalPostsInDb = rentalPostsInDb.Where(p => p.Accommodation.Address.Street.Contains(street));
            if (!publicLocationNearby.IsNullOrWhiteSpace())
                rentalPostsInDb = rentalPostsInDb.Where(p => p.Accommodation.Address.PublicLocationNearby.Contains(publicLocationNearby));

            // Search by Price
            if (paymentTypeId != 0)
            {
                rentalPostsInDb = rentalPostsInDb.Where(p => p.Accommodation.PaymentTypeId == paymentTypeId);
                if (minPrice != 0)
                    rentalPostsInDb = rentalPostsInDb.Where(p => p.Accommodation.Price >= minPrice);
                if (maxPrice != 0)
                    rentalPostsInDb = rentalPostsInDb.Where(p => p.Accommodation.Price <= maxPrice);
            }

            // Search by Accommodation type
            if (accommodationTypeId != 0)
            {
                rentalPostsInDb =
                    rentalPostsInDb.Where(p => p.Accommodation.AccommodationTypeId == accommodationTypeId);
            }

            // Search by Room area range
            if (roomAreaRangeId != 0)
            {
                rentalPostsInDb = rentalPostsInDb.Where(p => p.Accommodation.RoomAreaRangeId == roomAreaRangeId);
            }

            switch (haveAirConditioner)
            {
                // Search by Accommodation facilities
                case 1:
                    rentalPostsInDb = rentalPostsInDb.Where(p => p.Accommodation.HaveAirConditioner);
                    break;

                case -1:
                    rentalPostsInDb = rentalPostsInDb.Where(p => !p.Accommodation.HaveAirConditioner);
                    break;

                default:
                    if (haveAirConditioner != 0)
                        return BadRequest("Invalid input: haveAirConditioner.");
                    break;
            }

            switch (haveBalcony)
            {
                case 1:
                    rentalPostsInDb = rentalPostsInDb.Where(p => p.Accommodation.HaveBalcony);
                    break;

                case -1:
                    rentalPostsInDb = rentalPostsInDb.Where(p => !p.Accommodation.HaveBalcony);
                    break;

                default:
                    if (haveBalcony != 0)
                        return BadRequest("Invalid input: haveBalcony.");
                    break;
            }

            switch (haveClosedBathroom)
            {
                case 1:
                    rentalPostsInDb = rentalPostsInDb.Where(p => p.Accommodation.HaveClosedBathroom);
                    break;

                case -1:
                    rentalPostsInDb = rentalPostsInDb.Where(p => !p.Accommodation.HaveClosedBathroom);
                    break;

                default:
                    if (haveClosedBathroom != 0)
                        return BadRequest("Invalid input: haveCloseBathroom.");
                    break;
            }

            switch (haveWaterHeater)
            {
                case 1:
                    rentalPostsInDb = rentalPostsInDb.Where(p => p.Accommodation.HaveWaterHeater);
                    break;

                case -1:
                    rentalPostsInDb = rentalPostsInDb.Where(p => !p.Accommodation.HaveWaterHeater);
                    break;

                default:
                    if (haveWaterHeater != 0)
                        return BadRequest("Invalid input: haveWaterHeater.");
                    break;
            }

            switch (liveWithOwner)
            {
                case 1:
                    rentalPostsInDb = rentalPostsInDb.Where(p => p.Accommodation.LiveWithOwner);
                    break;

                case -1:
                    rentalPostsInDb = rentalPostsInDb.Where(p => !p.Accommodation.LiveWithOwner);
                    break;

                default:
                    if (liveWithOwner != 0)
                        return BadRequest("Invalid input: liveWithOwner");
                    break;
            }

            if (kitchenTypeId != 0)
                rentalPostsInDb = rentalPostsInDb.Where(p => p.Accommodation.KitchenTypeId == kitchenTypeId);

            // Page and limit result
            var listSimplePost = new ListSimplePost()
            {
                MaxPage = (int)Math.Ceiling(1.0 * rentalPostsInDb.Count() / _limit)
            };

            if (_page > listSimplePost.MaxPage)
                return NotFound();

            var rentalPosts = rentalPostsInDb.OrderBy(p => p.Id)
                .Skip(_limit * (_page - 1))
                .Take(_limit)
                .ToList();

            var simplePostDtos =
                rentalPosts.ConvertAll(Mapper.Map<AccommodationRentalPost, SimplePostDto>);

            foreach (var simplePostDto in simplePostDtos)
            {
                var comments = _context.Comments
                    .Where(c => c.IsApproved && c.AccommodationRentalPostId == simplePostDto.Id)
                    .ToList();
                if (comments.Count > 0)
                    simplePostDto.Rate = comments.Average(c => c.Rate * 1.0);
                else
                    simplePostDto.Rate = 0;
            }

            listSimplePost.SimplePostDtos = simplePostDtos;

            return Ok(listSimplePost);
        }

        // GET	/api/RentalPosts/Get/1
        [HttpGet]
        [Route("Get/{id}")]
        public IHttpActionResult GetRentalPost(int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var rentalPost = _context.AccommodationRentalPosts
                .Include(p => p.Accommodation.Address.Ward.District.Province)
                .Include(p => p.AccommodationPictures)
                .Include(p => p.Status)
                .Include(p => p.Accommodation.Owner)
                .Include(p => p.Accommodation.AccommodationType)
                .Include(p => p.Accommodation.KitchenType)
                .Include(p => p.Accommodation.PaymentType)
                .Include(p => p.Accommodation.RoomAreaRange)
                .Include(p => p.Accommodation.Status)
                .SingleOrDefault(r => r.Id == id);

            if (rentalPost == null)
                return NotFound();

            if (rentalPost.DateExpired < DateTime.Now || rentalPost.Status.Name != RentalPostStatusName.Approved)
            {
                if (User.IsInRole(RoleName.Owner))
                {
                    if (rentalPost.Accommodation.Owner.AccountId != User.Identity.GetUserId())
                        return NotFound();
                }

                if (!User.IsInRole(RoleName.Admin))
                    return NotFound();
            }

            var rentalPostDto = Mapper.Map<AccommodationRentalPost, AccommodationRentalPostDto>(rentalPost);
            rentalPostDto.Accommodation.Owner.Identification = null;
            rentalPostDto.Accommodation.Owner.Address = null;
            rentalPostDto.Accommodation.Owner.AccountId = null;

            var comments = _context.Comments
                .Where(c => c.IsApproved && c.AccommodationRentalPostId == rentalPostDto.Id)
                .ToList();
            if (comments.Count > 0)
                rentalPostDto.Rate = comments.Average(c => c.Rate * 1.0);
            else
                rentalPostDto.Rate = 0;

            var view = new View()
            {
                AccommodationRentalPostId = id,
                Time = DateTime.Now
            };
            _context.Views.Add(view);
            _context.SaveChangesAsync();

            return Ok(rentalPostDto);
        }

        // POST	/api/RentalPosts
        [Authorize(Roles = RoleName.Owner + ", " + RoleName.Admin)]
        [HttpPost]
        [Route("")]
        public IHttpActionResult AddRentalPost(AccommodationRentalPostDto accommodationRentalPostDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (accommodationRentalPostDto.AccommodationPictures.Count() < 3)
                return BadRequest("Please upload at least 3 pictures.");

            if (User.IsInRole(RoleName.Admin))
            {
                var ownerId = accommodationRentalPostDto.Accommodation.OwnerId;
                if (ownerId <= 0)
                    return BadRequest("OwnerId is required.");
                var ownerInDb = _context.Owners.SingleOrDefault(o => o.Id == ownerId);
                if (ownerInDb == null)
                    return BadRequest("The Owner does not exist.");
            }

            var address = accommodationRentalPostDto.Accommodation.Address;
            var ward = _context.Wards
                .Include(w => w.District.Province)
                .SingleOrDefault(w => w.Id == address.WardId);
            if (ward == null
                || ward.DistrictId != address.DistrictId
                || ward.District.ProvinceId != address.ProvinceId)
                return BadRequest("Address does not exist.");

            accommodationRentalPostDto.DateAdded = DateTime.Now;
            accommodationRentalPostDto.DateExpired = DateTime.Now.Add(new TimeSpan((int)accommodationRentalPostDto.TimeDisplayed, 0, 0, 0));

            accommodationRentalPostDto.Accommodation.StatusId =
                _context.AccommodationStatuses.Single(s => s.Name == AccommodationStatusName.NotRented).Id;

            if (User.IsInRole(RoleName.Owner))
            {
                accommodationRentalPostDto.StatusId =
                    _context.RentalPostStatuses.Single(s => s.Name == RentalPostStatusName.PendingApproval).Id;

                var accountId = User.Identity.GetUserId();
                accommodationRentalPostDto.Accommodation.OwnerId =
                    _context.Owners.Single(o => o.AccountId == accountId).Id;
            }
            else
            {
                accommodationRentalPostDto.StatusId =
                    _context.RentalPostStatuses.Single(s => s.Name == RentalPostStatusName.Approved).Id;
            }

            var rentalPost = Mapper.Map<AccommodationRentalPostDto, AccommodationRentalPost>(accommodationRentalPostDto);
            _context.AccommodationRentalPosts.Add(rentalPost);
            _context.SaveChanges();

            var response = Mapper.Map<AccommodationRentalPost, AccommodationRentalPostDto>(rentalPost);

            return Created(new Uri(Request.RequestUri + "/" + rentalPost.Id), response);
        }

        // PUT	/api/RentalPosts/Edit/1
        [Authorize(Roles = RoleName.Owner + ", " + RoleName.Admin)]
        [HttpPut]
        [Route("Edit/{id}")]
        public IHttpActionResult EditRentalPost(int id, AccommodationRentalPostDto accommodationRentalPostDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var rentalPostInDb = _context.AccommodationRentalPosts
                .Include(p => p.Status)
                .SingleOrDefault(p => p.Id == id);

            if (rentalPostInDb == null)
                return NotFound();

            if (rentalPostInDb.Status.Name != RentalPostStatusName.PendingApproval)
                return BadRequest("Can not edit post. Post status: " + rentalPostInDb.Status.Name);

            Mapper.Map(accommodationRentalPostDto, rentalPostInDb);

            if (User.IsInRole(RoleName.Admin))
                rentalPostInDb.StatusId = _context.RentalPostStatuses.Single(s => s.Name == RentalPostStatusName.Approved).Id;

            _context.SaveChanges();

            return Ok("Post has been edited.");
        }

        // GET api/RentalPosts/Fee
        [HttpGet]
        [Authorize(Roles = RoleName.Admin + ", " + RoleName.Owner)]
        [Route("Fee")]
        public IHttpActionResult GetPostFee(int timeDisplayed)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (timeDisplayed < 7 || timeDisplayed > 365)
                return BadRequest("Time to display post should be between 7 to 365 days.");

            return Ok(timeDisplayed * 5000);
        }

        // GET	api/RentalPosts/1/Views
        [HttpGet]
        [Route("{id}/Views")]
        public IHttpActionResult GetViews(int id)
        {
            var post = _context.AccommodationRentalPosts.SingleOrDefault(p => p.Id == id);
            if (post == null)
                return BadRequest("Post does not exist.");

            var views = _context.Views.Count(v => v.AccommodationRentalPostId == post.Id);

            return Ok(views);
        }

        // GET	api/RentalPosts/1/Likes
        [HttpGet]
        [Route("{id}/Likes")]
        public IHttpActionResult GetLikes(int id)
        {
            var post = _context.AccommodationRentalPosts.SingleOrDefault(p => p.Id == id);
            if (post == null)
                return BadRequest("Post does not exist.");

            var likes = _context.Likes.Count(v => v.AccommodationRentalPostId == post.Id);

            return Ok(likes);
        }

        // GET	api/RentalPosts/1/Comments
        [HttpGet]
        [Route("{id}/Comments")]
        public IHttpActionResult GetComments(int id, int _page = 1, int _limit = 10)
        {
            if (_page < 1)
                return BadRequest("Page must be at least 1.");

            var post = _context.AccommodationRentalPosts.SingleOrDefault(p => p.Id == id);
            if (post == null)
                return BadRequest("Post does not exist.");

            var commentsInDb = _context.Comments
                .Include(c => c.Renter)
                .Where(c => c.AccommodationRentalPostId == id && c.IsApproved);

            var listComments = new ListCommentsDto()
            {
                MaxPage = (int)Math.Ceiling(1.0 * commentsInDb.Count() / _limit)
            };

            if (_page > listComments.MaxPage)
                return NotFound();

            listComments.ListCommentDtos = commentsInDb
                .OrderBy(c => c.Id)
                .Skip(_limit * (_page - 1))
                .Take(_limit)
                .ToList().ConvertAll(Mapper.Map<Comment, CommentDto>);

            return Ok(listComments);
        }

        // GET	api/RentalPosts/Statuses
        [HttpGet]
        [Route("Statuses")]
        public IHttpActionResult GetPostStatuses()
        {
            var statuses = _context.RentalPostStatuses.ToList();
            return Ok(statuses);
        }
    }
}