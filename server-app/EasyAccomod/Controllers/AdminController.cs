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

        // POST api/Admin/SetRole
        [HttpPost]
        public IHttpActionResult SetRole(SetRoleBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Model state is invalid.");
            }

            var role = _context.Roles.SingleOrDefault(r => r.Name == model.RoleName);

            if (role == null)
                return BadRequest(model.RoleName + " does not exist.");

            var user = _context.Users.SingleOrDefault(u => u.UserName == model.UserName);

            if (user == null)
                return BadRequest("The user have user name " + model.UserName + " does not exist.");

            _userManager.AddToRole(user.Id, model.RoleName);

            return Ok();
        }
    }
}