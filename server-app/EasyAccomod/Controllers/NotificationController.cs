using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using EasyAccomod.Models;
using Microsoft.AspNet.Identity;

namespace EasyAccomod.Controllers
{
    [Authorize(Roles = RoleName.Admin + ", " + RoleName.Owner)]
    [RoutePrefix("api/Notifications")]
    public class NotificationController : ApiController
    {
        private readonly ApplicationDbContext _context;

        public NotificationController()
        {
            _context = new ApplicationDbContext();
        }

        // GET	api/Notifications
        [HttpGet]
        [Route("")]
        public IHttpActionResult GetNotification()
        {
            var accountId = User.Identity.GetUserId();

            var notifications = _context.Notifications
                .Where(n => n.AccountId == accountId)
                .OrderByDescending(n => n.Id)
                .Take(10)
                .ToList();

            return Ok(notifications);
        }

        // PUT	api/Notifications/Check
        [HttpPut]
        [Route("Check")]
        public IHttpActionResult CheckNotification(NotificationId notificationId)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var notification = _context.Notifications.SingleOrDefault(n => n.Id == notificationId.Id);

            if (notification == null)
                return BadRequest("Notification not found.");

            notification.HasBeenChecked = true;
            _context.SaveChanges();

            return Ok("Checked");
        }
    }
}