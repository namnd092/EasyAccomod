using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using EasyAccomod.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace EasyAccomod.Controllers
{
    [Authorize(Roles = RoleName.Admin)]
    public class AdminController : ApiController
    {
        private ApplicationDbContext _context;
        private UserManager<ApplicationUser> _userManager;

        public AdminController()
        {
            _context = new ApplicationDbContext();
            _userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(_context));
        }

        // POST api/Admin/SetOwner
        [HttpPost]
        public IHttpActionResult SetOwner(SetRoleBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = _context.Users.SingleOrDefault(u => u.UserName == model.UserName);
            if (user == null)
                return BadRequest("The user have user name " + model.UserName + " does not exist.");

            var owner = _context.Owners.SingleOrDefault(o => o.AccountId == user.Id);
            if (owner == null)
                return BadRequest("The user have user name " + model.UserName + " is not an Owner.");

            if (!_userManager.IsInRole(user.Id, RoleName.Owner))
                _userManager.AddToRole(user.Id, RoleName.Owner);

            return Ok();
        }
    }
}