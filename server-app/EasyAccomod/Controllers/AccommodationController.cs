using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Routing;
using AutoMapper;
using EasyAccomod.Dtos;
using EasyAccomod.Models;
using EasyAccomod.Models.AddressModel;
using Microsoft.AspNet.Identity;

namespace EasyAccomod.Controllers
{
    [Authorize]
    [RoutePrefix("api/Accommodations")]
    public class AccommodationController : ApiController
    {
        private ApplicationDbContext _context;

        public AccommodationController()
        {
            _context = new ApplicationDbContext();
        }

        // GET api/Accommodations
        [Authorize(Roles = RoleName.Owner)]
        [HttpGet]
        [Route("")]
        public IHttpActionResult GetAccommodations()
        {
            var ownerAccountId = User.Identity.GetUserId();
            var ownerId = _context.Owners.Single(o => o.AccountId == ownerAccountId).Id;

            var accommodations = _context.Accommodations
                .Where(a => a.OwnerId == ownerId)
                .Include(a => a.AccommodationType)
                .Include(a => a.Address)
                .Include(a => a.KitchenType)
                .Include(a => a.PaymentType)
                .Include(a => a.RoomAreaRange)
                .Include(a => a.Status)
                .ToList();

            if (!accommodations.Any())
                return NotFound();

            var accommodationDtos = accommodations.ConvertAll(a => Mapper.Map<Accommodation, AccommodationDto>(a));

            return Ok(accommodationDtos);
        }

        // GET	api/Accommodations/1
        [Authorize(Roles = RoleName.Owner + ", " + RoleName.Admin)]
        [HttpGet]
        [Route("{id}")]
        public IHttpActionResult GetAccommodation(int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var accommodation = _context.Accommodations
                .Include(a => a.AccommodationType)
                .Include(a => a.Address)
                .Include(a => a.KitchenType)
                .Include(a => a.PaymentType)
                .Include(a => a.RoomAreaRange)
                .Include(a => a.Status)
                .SingleOrDefault(a => a.Id == id);

            if (accommodation == null)
                return NotFound();

            var accommodationDto = Mapper.Map<Accommodation, AccommodationDto>(accommodation);

            return Ok(accommodationDto);
        }

        // GET api/Accommodations/Types
        [Authorize(Roles = RoleName.Owner + ", " + RoleName.Admin)]
        [HttpGet]
        [Route("Types")]
        public IHttpActionResult GetAccommodationTypes()
        {
            return Ok(_context.AccommodationTypes.ToList());
        }

        // GET api/Accommodations/PaymentTypes
        [Authorize(Roles = RoleName.Owner + ", " + RoleName.Admin)]
        [HttpGet]
        [Route("PaymentTypes")]
        public IHttpActionResult GetAccommodationPaymentTypes()
        {
            return Ok(_context.AccommodationPaymentTypes.ToList());
        }

        // GET api/Accommodations/KitchenTypes
        [Authorize(Roles = RoleName.Owner + ", " + RoleName.Admin)]
        [HttpGet]
        [Route("KitchenTypes")]
        public IHttpActionResult GetAccommodationKitchenTypes()
        {
            return Ok(_context.KitchenTypes.ToList());
        }

        // GET api/Accommodations/RoomAreaRanges
        [Authorize(Roles = RoleName.Owner + ", " + RoleName.Admin)]
        [HttpGet]
        [Route("RoomAreaRanges")]
        public IHttpActionResult GetRoomAreaRanges()
        {
            return Ok(_context.RoomAreaRanges.ToList());
        }

        // GET api/Accommodations/Statuses
        [Authorize(Roles = RoleName.Owner + ", " + RoleName.Admin)]
        [HttpGet]
        [Route("Statuses")]
        public IHttpActionResult GetAccommodationStatuses()
        {
            return Ok(_context.AccommodationStatuses.ToList());
        }

        // POST	api/Accommodations
        [Authorize(Roles = RoleName.Owner)]
        [HttpPost]
        [Route("")]
        public IHttpActionResult AddAccommodation(AccommodationDto accommodationDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var accommodation = Mapper.Map<AccommodationDto, Accommodation>(accommodationDto);

            var ownerAccountId = User.Identity.GetUserId();
            accommodation.OwnerId = _context.Owners.Single(o => o.AccountId == ownerAccountId).Id;

            _context.Accommodations.Add(accommodation);
            _context.SaveChanges();

            var accommodationInDb = _context.Accommodations
                .Include(a => a.AccommodationType)
                .Include(a => a.Address)
                .Include(a => a.KitchenType)
                .Include(a => a.PaymentType)
                .Include(a => a.RoomAreaRange)
                .Include(a => a.Status)
                .Single(a => a.Id == accommodation.Id);

            var responseAccommodationDto = Mapper.Map<Accommodation, AccommodationDto>(accommodationInDb);

            return Created(new Uri(Request.RequestUri + "/" + accommodation.Id), responseAccommodationDto);
        }
    }
}