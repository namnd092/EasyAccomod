using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using EasyAccomod.Models;
using System.Data.Entity;
using System.Web.Management;
using AutoMapper;
using EasyAccomod.Dtos;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace EasyAccomod.Controllers
{
    [Authorize(Roles = RoleName.Owner)]
    [RoutePrefix("api/Owner")]
    public class OwnerController : ApiController
    {
        private readonly ApplicationDbContext _context;

        public OwnerController()
        {
            _context = new ApplicationDbContext();
        }

        // GET api/Owner/RentalPosts
        [HttpGet]
        [Route("RentalPosts")]
        public IHttpActionResult GetRentalPost(int _page = 1, int _limit = 15, byte statusId = 0, int isExpired = 0, int wasRented = 0)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (_page < 1)
                return BadRequest("Page must be at least 1.");

            var accountId = User.Identity.GetUserId();
            var rentalPostsInDb = _context.AccommodationRentalPosts
                .Include(p => p.Status)
                .Include(p => p.Accommodation.Address.Ward.District.Province)
                .Include(p => p.Accommodation.Status)
                .Where(p => p.Accommodation.Owner.AccountId == accountId);

            if (statusId != 0)
                rentalPostsInDb = rentalPostsInDb.Where(p => p.StatusId == statusId);

            switch (isExpired)
            {
                case 1:
                    rentalPostsInDb = rentalPostsInDb.Where(p => p.DateExpired < DateTime.Now);
                    break;

                case -1:
                    rentalPostsInDb = rentalPostsInDb.Where(p => p.DateExpired > DateTime.Now);
                    break;

                default:
                    if (isExpired != 0)
                        return BadRequest("Invalid input: isExpired.");
                    break;
            }

            switch (wasRented)
            {
                case 1:
                    rentalPostsInDb =
                        rentalPostsInDb.Where(p => p.Accommodation.Status.Name == AccommodationStatusName.Rented);
                    break;

                case -1:
                    rentalPostsInDb =
                        rentalPostsInDb.Where(p => p.Accommodation.Status.Name == AccommodationStatusName.NotRented);
                    break;

                default:
                    if (wasRented != 0)
                        return BadRequest("Invalid input: wasRented.");
                    break;
            }

            var listSimplePost = new ListOwnerSimplePost()
            {
                MaxPage = (int)Math.Ceiling(1.0 * rentalPostsInDb.Count() / _limit),
                OwnerSimplePostDtos = rentalPostsInDb.OrderBy(p => p.Id)
                    .Skip(_limit * (_page - 1))
                    .Take(_limit)
                    .ToList()
                    .ConvertAll(Mapper.Map<AccommodationRentalPost, OwnerSimplePostDto>)
            };

            foreach (var ownerSimplePostDto in listSimplePost.OwnerSimplePostDtos)
            {
                ownerSimplePostDto.Likes =
                    _context.Likes.Count(l => l.AccommodationRentalPostId == ownerSimplePostDto.Id);

                ownerSimplePostDto.Views =
                    _context.Views.Count(v => v.AccommodationRentalPostId == ownerSimplePostDto.Id);
            }

            return Ok(listSimplePost);
        }

        //// POST api/Owner/RentalPosts/1/Edit
        //[HttpPost]
        //[Route("RentalPosts/{id}/Edit")]
        //public IHttpActionResult SendEditRequest(int id)
        //{
        //    var rentalPostInDb = _context.AccommodationRentalPosts
        //        .Include(p => p.Status)
        //        .Include(p => p.Accommodation.Owner)
        //        .SingleOrDefault(p => p.Id == id);

        //    if (rentalPostInDb == null)
        //        return BadRequest("Rental post does not exist.");

        //    if (rentalPostInDb.Accommodation.Owner.AccountId != User.Identity.GetUserId())
        //        return BadRequest("You do not have permission to edit this post.");

        //    rentalPostInDb.StatusId = _context.RentalPostStatuses
        //        .Single(s => s.Name == RentalPostStatusName.WaitingEditPermission).Id;

        //    _context.SaveChanges();

        //    return Ok();
        //}

        // PUT api/Owner/Accommodation/SetStatus
        [HttpPut]
        [Route("Accommodation/SetStatus")]
        public IHttpActionResult SetAccommodationStatus(SetAccommodationStatusDto setAccommodationStatusDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var accommodationInDb = _context.Accommodations
                .Include(a => a.Owner)
                .SingleOrDefault(a => a.Id == setAccommodationStatusDto.AccommodationId);

            if (accommodationInDb == null)
                return BadRequest("Accommodation does not exist.");

            if (accommodationInDb.Owner.AccountId != User.Identity.GetUserId())
                return BadRequest("You do not have permission to edit this accommodation.");

            var notification = new Notification()
            {
                AccountId = _context.Admins.First().AccountId,
                HasBeenChecked = false,
                RentalPostId = _context.AccommodationRentalPosts
                    .First(p => p.Accommodation.Id == accommodationInDb.Id).Id,
                Time = DateTime.Now
            };

            var ownerName = accommodationInDb.Owner.Name;

            if ((bool)setAccommodationStatusDto.WasRented)
            {
                accommodationInDb.StatusId = _context.AccommodationStatuses
                    .Single(s => s.Name == AccommodationStatusName.Rented).Id;

                notification.Content = ownerName + " đã cập nhật trạng thái phòng trọ thành đã cho thuê.";

                _context.Notifications.Add(notification);
                _context.SaveChanges();

                return Ok("Accommodation status: " + accommodationInDb.Status.Name);
            }

            accommodationInDb.StatusId = _context.AccommodationStatuses
                    .Single(s => s.Name == AccommodationStatusName.NotRented).Id;

            notification.Content = ownerName + " đã cập nhật trạng thái phòng trọ thành chưa cho thuê.";

            _context.Notifications.Add(notification);
            _context.SaveChanges();

            return Ok("Accommodation status: " + accommodationInDb.Status.Name);
        }

        // POST	api/Owner/RentalPosts/ExtendPeriod
        [HttpPost]
        [Route("RentalPosts/ExtendPeriod")]
        public IHttpActionResult ExtendRentalPostPeriod(ExtendRentalPostPeriodDto extendRentalPostPeriodDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (_context.ExtendRentalPostPeriods.Any(e =>
                e.AccommodationRentalPostId == extendRentalPostPeriodDto.AccommodationRentalPostId))
                return BadRequest("Please wait until the previous request has been resolved.");

            var rentalPostInDb =
                _context.AccommodationRentalPosts
                    .Include(p => p.Accommodation.Owner)
                    .SingleOrDefault(p =>
                    p.Id == extendRentalPostPeriodDto.AccommodationRentalPostId);

            if (rentalPostInDb == null)
                return BadRequest("Post does not exist.");

            if (rentalPostInDb.Accommodation.Owner.AccountId != User.Identity.GetUserId())
                return BadRequest("You don't have permission with this post.");

            var extendRentalPostPeriod =
                Mapper.Map<ExtendRentalPostPeriodDto, ExtendRentalPostPeriod>(extendRentalPostPeriodDto);
            _context.ExtendRentalPostPeriods.Add(extendRentalPostPeriod);
            _context.SaveChanges();

            return Ok();
        }

        // GET	api/Owner/EditInfoStatus
        [HttpGet]
        [Route("EditInfoStatus")]
        public IHttpActionResult EditInfoStatus()
        {
            int result = -1;

            var accountId = User.Identity.GetUserId();
            var ownerId = _context.Owners.Single(o => o.AccountId == accountId).Id;

            var request = _context.EditInfoRequests.SingleOrDefault(r => r.OwnerId == ownerId);
            if (request != null)
            {
                result = request.CanEditInfo ? 1 : 0;
            }

            return Ok(new { result });
        }

        // POST	api/Owner/RequireEditInfo
        [HttpPost]
        [Route("RequireEditInfo")]
        public IHttpActionResult RequireEditInfo()
        {
            var accountId = User.Identity.GetUserId();
            var ownerId = _context.Owners.Single(o => o.AccountId == accountId).Id;

            var requestInDb = _context.EditInfoRequests.SingleOrDefault(r => r.OwnerId == ownerId);
            if (requestInDb != null)
                return BadRequest("You has been required edit info yet.");

            var request = new EditInfoRequest()
            {
                OwnerId = ownerId,
                CanEditInfo = false
            };

            _context.EditInfoRequests.Add(request);
            _context.SaveChanges();

            return Ok("Required");
        }

        // PUT	api/Owner/EditInfo
        [HttpPut]
        [Route("EditInfo")]
        public IHttpActionResult EditInfo(OwnerDto ownerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var accountId = User.Identity.GetUserId();

            var ownerInDb = _context.Owners.Single(o => o.AccountId == accountId);

            var request = _context.EditInfoRequests.SingleOrDefault(r => r.OwnerId == ownerInDb.Id);

            if (request == null)
                return BadRequest("You need require edit info permission from Admin first.");

            if (!request.CanEditInfo)
                return BadRequest("Wait until Admin approved your edit request.");

            ownerInDb = Mapper.Map(ownerDto, ownerInDb);

            using (var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(_context)))
            {
                userManager.RemoveFromRole(accountId, RoleName.Owner);
                userManager.AddToRole(accountId, RoleName.WaitForConfirmation);
            }

            _context.EditInfoRequests.Remove(request);
            _context.SaveChanges();

            return Ok("Edited info");
        }
    }
}