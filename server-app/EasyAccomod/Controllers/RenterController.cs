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
using System.Data.Entity;

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

        // GET	api/Renter/RentalPost/Likes
        [HttpGet]
        [Route("RentalPost/Likes")]
        public IHttpActionResult GetLikedPost(int _page = 1, int _limit = 15)
        {
            if (_page < 1)
                return BadRequest("Page must be at least 1.");

            var accountId = User.Identity.GetUserId();
            var renterId = _context.Renters.Single(r => r.AccountId == accountId).Id;

            var listLikedPostsInDb = _context.AccommodationRentalPosts
                .Include(p => p.Status)
                .Include(p => p.AccommodationPictures)
                .Include(p => p.Accommodation.Address.Province)
                .Include(p => p.Accommodation.PaymentType)
                .Include(p => p.Accommodation.RoomAreaRange)
                .Where(p => _context.Likes.Any(l =>
                                l.AccommodationRentalPostId == p.Id && l.RenterId == renterId))
                .Where(p => p.DateExpired > DateTime.Now && p.Status.Name == RentalPostStatusName.Approved);

            var listSimplePosts = new ListSimplePost()
            {
                MaxPage = (int)Math.Ceiling(1.0 * listLikedPostsInDb.Count() / _limit)
            };

            if (_page > listSimplePosts.MaxPage)
                return NotFound();

            var listLikedPosts = listLikedPostsInDb
                .OrderBy(p => p.Id)
                .Skip(_limit * (_page - 1))
                .Take(_limit)
                .ToList();

            listSimplePosts.SimplePostDtos =
                listLikedPosts.ConvertAll(Mapper.Map<AccommodationRentalPost, SimplePostDto>);

            return Ok(listSimplePosts);
        }

        // POST	api/Renter/RentalPost/Like
        [HttpPost]
        [Route("RentalPost/Like")]
        public IHttpActionResult Like(LikeDto likeDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var post = _context.AccommodationRentalPosts
                .Include(p => p.Status)
                .SingleOrDefault(p => p.Id == likeDto.AccommodationRentalPostId);

            if (post == null || post.Status.Name != RentalPostStatusName.Approved || post.DateExpired < DateTime.Now)
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

        // POST	api/Renter/RentalPost/Report
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
            if (_context.Reports
                    .SingleOrDefault(r => r.RenterId == reportDto.RenterId
                                          && r.AccommodationRentalPostId == reportDto.AccommodationRentalPostId) != null)
                return BadRequest("Each Renter should be report only 1 time.");

            var report = Mapper.Map<ReportDto, Report>(reportDto);
            report.IsSolved = false;
            report.Time = DateTime.Now;

            _context.Reports.Add(report);
            var result = _context.SaveChanges();

            return Ok("Reported");
        }

        // GET	api/Renter/RentalPost/IsLiked
        [HttpGet]
        [Route("RentalPost/IsLiked")]
        public IHttpActionResult GetLikeStatus(int postId = 0)
        {
            if (_context.AccommodationRentalPosts.SingleOrDefault(p => p.Id == postId)
                == null)
            {
                return BadRequest("Post does not exist.");
            }

            var accountId = User.Identity.GetUserId();
            var renterId = _context.Renters.Single(r => r.AccountId == accountId).Id;

            var result = _context.Likes.Any(l => l.RenterId == renterId && l.AccommodationRentalPostId == postId);

            return Ok(new { result });
        }

        // GET	api/Renter/RentalPost/IsCommented
        [HttpGet]
        [Route("RentalPost/IsCommented")]
        public IHttpActionResult GetCommentStatus(int postId = 0)
        {
            if (_context.AccommodationRentalPosts.SingleOrDefault(p => p.Id == postId)
                == null)
            {
                return BadRequest("Post does not exist.");
            }

            var accountId = User.Identity.GetUserId();
            var renterId = _context.Renters.Single(r => r.AccountId == accountId).Id;

            var result = _context.Comments.Any(l => l.RenterId == renterId && l.AccommodationRentalPostId == postId);

            return Ok(new { result });
        }

        // GET	api/Renter/RentalPost/IsReported
        [HttpGet]
        [Route("RentalPost/IsReported")]
        public IHttpActionResult GetReportStatus(int postId = 0)
        {
            if (_context.AccommodationRentalPosts.SingleOrDefault(p => p.Id == postId)
                == null)
            {
                return BadRequest("Post does not exist.");
            }

            var accountId = User.Identity.GetUserId();
            var renterId = _context.Renters.Single(r => r.AccountId == accountId).Id;

            var result = _context.Reports.Any(l => l.RenterId == renterId && l.AccommodationRentalPostId == postId);

            return Ok(new { result });
        }
    }
}