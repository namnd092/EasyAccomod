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
    [AllowAnonymous]
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
            , bool liveWithOwner = false, bool haveClosedBathroom = false, bool haveWaterHeater = false
            , byte kitchenTypeId = 0, bool haveAirConditioner = false, bool haveBalcony = false)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (_page < 1)
                return BadRequest("Page must be at least 1.");

            if (_page > Math.Ceiling(1.0 * _context.AccommodationRentalPosts.Count() / _limit))
                return NotFound();

            var rentalPostsInDb = _context.AccommodationRentalPosts
                .Include(p => p.Accommodation.Address)
                .Include(p => p.AccommodationPictures)
                .Where(p => p.DateExpired > DateTime.Now && p.Status.Name == "Được duyệt");

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

            // Search by Accommodation facilities
            if (haveAirConditioner)
                rentalPostsInDb = rentalPostsInDb.Where(p => p.Accommodation.HaveAirConditioner);
            if (haveBalcony)
                rentalPostsInDb = rentalPostsInDb.Where(p => p.Accommodation.HaveBalcony);
            if (haveClosedBathroom)
                rentalPostsInDb = rentalPostsInDb.Where(p => p.Accommodation.HaveClosedBathroom);
            if (haveWaterHeater)
                rentalPostsInDb = rentalPostsInDb.Where(p => p.Accommodation.HaveWaterHeater);
            if (liveWithOwner)
                rentalPostsInDb = rentalPostsInDb.Where(p => p.Accommodation.LiveWithOwner);
            if (kitchenTypeId != 0)
                rentalPostsInDb = rentalPostsInDb.Where(p => p.Accommodation.KitchenTypeId == kitchenTypeId);

            // Page and limit result
            var rentalPosts = rentalPostsInDb.OrderBy(p => p.Id)
                .Skip(_limit * (_page - 1))
                .Take(_limit)
                .ToList();

            var rentalPostDtos =
                rentalPosts.ConvertAll(Mapper.Map<AccommodationRentalPost, AccommodationRentalPostDto>);

            return Ok(rentalPostDtos);
        }

        // GET	/api/RentalPosts/Get/1
        [HttpGet]
        [Route("Get/{id}")]
        public IHttpActionResult GetRentalPost(int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var rentalPost = _context.AccommodationRentalPosts
                .Include(p => p.Accommodation.Address)
                .Include(p => p.AccommodationPictures)
                .SingleOrDefault(r => r.Id == id);
            if (rentalPost == null)
                return NotFound();

            var rentalPostDto = Mapper.Map<AccommodationRentalPost, AccommodationRentalPostDto>(rentalPost);

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
                _context.AccommodationStatuses.Single(s => s.Name == "Chưa cho thuê").Id;

            if (User.IsInRole(RoleName.Owner))
            {
                accommodationRentalPostDto.StatusId =
                    _context.RentalPostStatuses.Single(s => s.Name == "Đang chờ duyệt").Id;

                var accountId = User.Identity.GetUserId();
                accommodationRentalPostDto.Accommodation.OwnerId =
                    _context.Owners.Single(o => o.AccountId == accountId).Id;
            }
            else
            {
                accommodationRentalPostDto.StatusId =
                    _context.RentalPostStatuses.Single(s => s.Name == "Được duyệt").Id;
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

            if (rentalPostInDb.Status.Name != "Đang chờ duyệt")
                return BadRequest("Can not edit post. Post status: " + rentalPostInDb.Status.Name);

            Mapper.Map(accommodationRentalPostDto, rentalPostInDb);

            _context.SaveChanges();

            return Ok();
        }

        // PUT	/api/RentalPosts/1/SetStatus
        [Authorize(Roles = RoleName.Admin)]
        [HttpPut]
        [Route("{id}/SetStatus")]
        public IHttpActionResult SetRentalPostStatus(int id, RentalPostStatusDto rentalPostStatusDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var rentalPostInDb = _context.AccommodationRentalPosts
                .Include(p => p.Status)
                .SingleOrDefault(p => p.Id == id);

            if (rentalPostInDb == null)
                return NotFound();

            var status = _context.RentalPostStatuses.SingleOrDefault(s => s.Id == rentalPostStatusDto.Id);
            if (status == null)
                return BadRequest("Status does not exist.");

            rentalPostInDb.StatusId = (byte)rentalPostStatusDto.Id;

            return Ok();
        }
    }
}