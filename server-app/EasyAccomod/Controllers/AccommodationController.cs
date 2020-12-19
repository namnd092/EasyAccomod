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
using Microsoft.Ajax.Utilities;
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
        [AllowAnonymous]
        [HttpGet]
        [Route("Types")]
        public IHttpActionResult GetAccommodationTypes()
        {
            return Ok(_context.AccommodationTypes.ToList());
        }

        // GET api/Accommodations/PaymentTypes
        [AllowAnonymous]
        [HttpGet]
        [Route("PaymentTypes")]
        public IHttpActionResult GetAccommodationPaymentTypes()
        {
            return Ok(_context.AccommodationPaymentTypes.ToList());
        }

        // GET api/Accommodations/KitchenTypes
        [AllowAnonymous]
        [HttpGet]
        [Route("KitchenTypes")]
        public IHttpActionResult GetAccommodationKitchenTypes()
        {
            return Ok(_context.KitchenTypes.ToList());
        }

        // GET api/Accommodations/RoomAreaRanges
        [AllowAnonymous]
        [HttpGet]
        [Route("RoomAreaRanges")]
        public IHttpActionResult GetRoomAreaRanges()
        {
            return Ok(_context.RoomAreaRanges.ToList());
        }

        // GET api/Accommodations/Statuses
        [AllowAnonymous]
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

            if (!(bool)accommodationDto.IsStateElectricityPrice)
            {
                if (accommodationDto.ElectricityPrice <= 0)
                    return BadRequest("Enter Electricity price.");
            }
            else
            {
                accommodationDto.ElectricityPrice = 0;
            }

            if (!(bool)accommodationDto.IsStateWaterPrice)
            {
                if (accommodationDto.WaterPrice <= 0)
                    return BadRequest("Enter Water price.");
            }
            else
            {
                accommodationDto.WaterPrice = 0;
            }

            var accommodation = Mapper.Map<AccommodationDto, Accommodation>(accommodationDto);

            var ownerAccountId = User.Identity.GetUserId();
            accommodation.OwnerId = _context.Owners.Single(o => o.AccountId == ownerAccountId).Id;
            accommodation.StatusId = _context.AccommodationStatuses.Single(s => s.Name == "Chưa cho thuê").Id;

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