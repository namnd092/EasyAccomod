using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AutoMapper;
using EasyAccomod.Dtos;
using EasyAccomod.Models;
using Microsoft.AspNet.Identity;

namespace EasyAccomod.Controllers
{
    [Authorize(Roles = RoleName.Renter)]
    [RoutePrefix("api/Renter")]
    public class RenterController : ApiController
    {
        private readonly ApplicationDbContext _context;

        public RenterController()
        {
            _context = new ApplicationDbContext();
        }

        // POST	api/Renter/RenterPost/Like
        [HttpPost]
        [Route("RentalPost/Like")]
        public IHttpActionResult Like(LikeDto likeDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (_context.AccommodationRentalPosts.SingleOrDefault(p => p.Id == likeDto.AccommodationRentalPostId) ==
                null)
                return BadRequest("Post does not exist.");

            var accountId = User.Identity.GetUserId();
            likeDto.RenterId = _context.Renters.Single(r => r.AccountId == accountId).Id;
            likeDto.Time = DateTime.Now;

            var likeInDb = _context.Likes
                .SingleOrDefault(l => l.AccommodationRentalPostId == likeDto.AccommodationRentalPostId && l.RenterId == likeDto.RenterId);

            if (likeInDb != null)
            {
                _context.Likes.Remove(likeInDb);
                _context.SaveChanges();
                return Ok("Dislike");
            }

            var like = Mapper.Map<LikeDto, Like>(likeDto);
            _context.Likes.Add(like);
            var result = _context.SaveChanges();

            return Ok("Like");
        }

        // POST	api/Renter/RentalPost/Comment
        [HttpPost]
        [Route("RentalPost/Comment")]
        public IHttpActionResult Comment(CommentDto commentDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (_context.AccommodationRentalPosts.SingleOrDefault(p => p.Id == commentDto.AccommodationRentalPostId)
                == null)
            {
                return BadRequest("Post does not exist.");
            }

            var accountId = User.Identity.GetUserId();
            commentDto.RenterId = _context.Renters.Single(r => r.AccountId == accountId).Id;
            if (_context.Comments.SingleOrDefault(c => c.RenterId == commentDto.RenterId) != null)
                return BadRequest("Each Renter should be comment only 1 time.");

            var comment = Mapper.Map<CommentDto, Comment>(commentDto);
            comment.IsApproved = false;
            comment.Time = DateTime.Now;

            _context.Comments.Add(comment);
            var result = _context.SaveChanges();

            return Ok();
        }

        // POST	api/Renter/RenterPost/Report
        [HttpPost]
        [Route("RentalPost/Report")]
        public IHttpActionResult Report(ReportDto reportDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (_context.AccommodationRentalPosts.SingleOrDefault(p => p.Id == reportDto.AccommodationRentalPostId)
                == null)
            {
                return BadRequest("Post does not exist.");
            }

            var accountId = User.Identity.GetUserId();
            reportDto.RenterId = _context.Renters.Single(r => r.AccountId == accountId).Id;
            if (_context.Reports.SingleOrDefault(c => c.RenterId == reportDto.RenterId) != null)
                return BadRequest("Each Renter should be report only 1 time.");

            var report = Mapper.Map<ReportDto, Report>(reportDto);
            report.IsSolved = false;
            report.Time = DateTime.Now;

            _context.Reports.Add(report);
            var result = _context.SaveChanges();

            return Ok("Reported");
        }
    }
}