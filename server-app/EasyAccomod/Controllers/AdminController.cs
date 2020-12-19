using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
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

            var listOwnersInDb = _context.Owners.AsQueryable();

            switch (confirmationStatus)
            {
                case 1:
                    listOwnersInDb = listOwnersInDb
                        .Where(o => _userManager.IsInRole(o.AccountId, RoleName.Owner));
                    break;

                case -1:
                    listOwnersInDb = listOwnersInDb
                        .Where(o => _userManager.IsInRole(o.AccountId, RoleName.WaitForConfirmation));
                    break;

                default:
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
                MaxPage = (int)Math.Ceiling(1.0 * listOwnersInDb.Count() / _limit)
            };

            return Ok(listOwnersDto);
        }

        // POST api/Admin/SetOwner
        [HttpPost]
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

            return Ok();
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
    }
}