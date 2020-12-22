using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AutoMapper;
using EasyAccomod.Dtos;
using EasyAccomod.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace EasyAccomod.Controllers
{
    [Authorize(Roles = RoleName.Admin)]
    [RoutePrefix("api/Admin")]
    public class AdminController : ApiController
    {
        private ApplicationDbContext _context;
        private UserManager<ApplicationUser> _userManager;

        public AdminController()
        {
            _context = new ApplicationDbContext();
            _userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(_context));
        }

        // GET	api/Admin/Owners
        [HttpGet]
        [Route("Owners")]
        public IHttpActionResult GetOwners(int _page = 1, int _limit = 15, int confirmationStatus = -1)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (_page < 1)
                return BadRequest();

            var listOwnersInDb = _context.Owners.ToList();

            switch (confirmationStatus)
            {
                case 1:
                    // Owner has been approved
                    listOwnersInDb = listOwnersInDb
                        .Where(o => _userManager.IsInRole(o.AccountId, RoleName.Owner)).ToList();
                    break;

                case -1:
                    // Owner are waiting for confirmation
                    listOwnersInDb = listOwnersInDb
                        .Where(o => _userManager.IsInRole(o.AccountId, RoleName.WaitForConfirmation)).ToList();
                    break;

                default:
                    // All Owner
                    if (confirmationStatus != 0)
                        return BadRequest("Invalid input: confirmationStatus.");
                    break;
            }

            var listOwners = listOwnersInDb
                    .OrderBy(o => o.Id)
                    .Skip(_limit * (_page - 1))
                    .Take(_limit)
                    .ToList();

            var listOwnersDto = new ListOwnersDto()
            {
                Owners = listOwners.ConvertAll(Mapper.Map<Owner, OwnerDto>),
                MaxPage = (int)Math.Ceiling(1.0 * listOwnersInDb.Count / _limit)
            };

            return Ok(listOwnersDto);
        }

        // POST api/Admin/SetOwner
        [HttpPost]
        [Route("SetOwner")]
        public IHttpActionResult SetOwner(SetRoleBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = _context.Users.SingleOrDefault(u => u.Id == model.AccountId);
            if (user == null)
                return BadRequest("The user have account id " + model.AccountId + " does not exist.");

            var owner = _context.Owners.SingleOrDefault(o => o.AccountId == user.Id);
            if (owner == null)
                return BadRequest("The user have account id " + model.AccountId + " is not an Owner.");

            var listRole = _userManager.GetRoles(user.Id);

            if (listRole.Count > 0)
            {
                _userManager.RemoveFromRoles(user.Id, listRole.ToArray());
            }
            _userManager.AddToRole(user.Id, RoleName.Owner);

            return Ok("Approved");
        }

        // POST	api/Admin/RejectOwner
        [HttpPost]
        [Route("RejectOwner")]
        public IHttpActionResult RejectOwner(SetRoleBindingModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = _context.Users.SingleOrDefault(u => u.Id == model.AccountId);
            if (user == null)
                return BadRequest("The user have account id " + model.AccountId + " does not exist.");

            var owner = _context.Owners.SingleOrDefault(o => o.AccountId == user.Id);
            if (owner == null)
                return BadRequest("The user have account id " + model.AccountId + " is not an Owner.");

            if (!_userManager.IsInRole(model.AccountId, RoleName.WaitForConfirmation))
                return BadRequest("User has been approved.");

            _context.Owners.Remove(owner);
            _context.SaveChanges();
            _userManager.Delete(user);
            _context.SaveChanges();

            return Ok("Rejected");
        }

        // PUT	api/Admin/RentalPosts/1/SetStatus
        [HttpPut]
        [Route("RentalPosts/{id}/SetStatus")]
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
            _context.SaveChanges();

            return Ok();
        }

        // GET	api/Admin/RentalPosts
        [HttpGet]
        [Route("RentalPosts")]
        public IHttpActionResult SearchPostByStatus(int _page = 1, int _limit = 10, byte statusId = 0)
        {
            if (_page < 1)
                return BadRequest("Page must be at least 1.");

            var postInDb = _context.AccommodationRentalPosts
                .Include(p => p.Accommodation.Owner)
                .Include(p => p.Status);

            if (statusId != 0)
            {
                if (!_context.RentalPostStatuses.Any(s => s.Id == statusId))
                    return BadRequest("Status does not exist.");

                postInDb = postInDb.Where(p => p.StatusId == statusId);
            }

            var listSimplePost = new ListAdminSimplePost()
            {
                MaxPage = (int)Math.Ceiling(1.0 * postInDb.Count() / _limit)
            };

            listSimplePost.SimplePostDtos = postInDb.OrderBy(p => p.Id)
                .Skip(_limit * (_page - 1))
                .Take(_limit)
                .ToList()
                .ConvertAll(Mapper.Map<AccommodationRentalPost, AdminSimplePostDto>);

            return Ok(listSimplePost);
        }

        // GET	api/Admin/RentalPosts/ExtendPeriod
        [HttpGet]
        [Route("RentalPosts/ExtendPeriod")]
        public IHttpActionResult GetExtendPeriodPost(int _page = 1, int _limit = 10)
        {
            if (_page < 1)
                return BadRequest("Page >= 1");

            var listPost = _context.AccommodationRentalPosts
                .Include(p => p.Accommodation.Owner)
                .Include(p => p.Status)
                .Join(_context.ExtendRentalPostPeriods, p => p.Id, e => e.AccommodationRentalPostId
                    , (p, e) => new
                    {
                        p.Id,
                        p.Title,
                        p.DateAdded,
                        OwnerName = p.Accommodation.Owner.Name,
                        OwnerEmail = p.Accommodation.Owner.Email,
                        Status = p.Status.Name,
                        e.ExtendPeriod,
                        ExtendId = e.Id
                    });

            var result = new
            {
                MaxPage = (int)Math.Ceiling(1.0 * listPost.Count() / _limit),
                ListPost = listPost.OrderBy(p => p.Id)
                    .Skip(_limit * (_page - 1))
                    .Take(_limit)
                    .ToList()
            };

            return Ok(result);
        }

        // POST api/Admin/RentalPost/ExtendPeriod/Approve
        [HttpPost]
        [Route("RentalPost/ExtendPeriod/Approve")]
        public IHttpActionResult ApproveExtend(ExtendId extendId)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var extend = _context.ExtendRentalPostPeriods.SingleOrDefault(e => e.Id == extendId.Id);

            if (extend == null)
                return BadRequest("Extend request does not exits.");

            var post = _context.AccommodationRentalPosts.SingleOrDefault(p => p.Id == extend.AccommodationRentalPostId);

            if (post == null)
                return BadRequest("Post not found.");

            post.DateExpired = post.DateExpired.Add(new TimeSpan(extend.ExtendPeriod, 0, 0, 0));
            _context.ExtendRentalPostPeriods.Remove(extend);
            _context.SaveChanges();

            return Ok("Approved");
        }

        // POST api/Admin/RentalPost/ExtendPeriod/Reject
        [HttpPost]
        [Route("RentalPost/ExtendPeriod/Reject")]
        public IHttpActionResult RejectExtend(ExtendId extendId)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var extend = _context.ExtendRentalPostPeriods.SingleOrDefault(e => e.Id == extendId.Id);

            if (extend == null)
                return BadRequest("Extend request does not exits.");

            _context.ExtendRentalPostPeriods.Remove(extend);
            _context.SaveChanges();

            return Ok("Rejected");
        }
    }
}