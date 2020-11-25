using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using System.Web.Http;
using System.Web.Http.Results;
using AutoMapper;
using EasyAccomod.Dtos;
using EasyAccomod.Models;
using EasyAccomod.Models.AddressModel;

namespace EasyAccomod.Controllers
{
    [RoutePrefix("api")]
    public class AddressController : ApiController
    {
        private ApplicationDbContext _context;

        public AddressController()
        {
            _context = new ApplicationDbContext();
        }

        // GET api/Provinces
        [AllowAnonymous]
        [HttpGet]
        [Route("Provinces")]
        public IHttpActionResult GetProvinces()
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var listProvinceDtos = _context.Provinces
                .ToList()
                .ConvertAll(p => Mapper.Map<Province, ProvinceDto>(p));

            return Ok(listProvinceDtos);
        }

        // GET api/Provinces/1
        [AllowAnonymous]
        [HttpGet]
        [Route("Provinces/{id}")]
        public IHttpActionResult GetProvince(byte id)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var province = _context.Provinces.SingleOrDefault(p => p.Id == id);

            if (province == null)
                return NotFound();

            var provinceDto = Mapper.Map<Province, ProvinceDto>(province);

            return Ok(provinceDto);
        }

        // GET api/Provinces/1/Districts
        [AllowAnonymous]
        [HttpGet]
        [Route("Provinces/{provinceId}/Districts")]
        public IHttpActionResult GetDistricts(byte provinceId)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var listDistricts = _context.Districts
                .Where(d => d.ProvinceId == provinceId)
                .Include(d => d.Province)
                .ToList();

            if (!listDistricts.Any())
                return NotFound();

            var listDistrictDtos = listDistricts.ConvertAll(d => Mapper.Map<District, DistrictDto>(d));

            return Ok(listDistrictDtos);
        }

        // GET api/Districts/1
        [AllowAnonymous]
        [HttpGet]
        [Route("Districts/{id}")]
        public IHttpActionResult GetDistrict(int id)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var district = _context.Districts
                .Include(d => d.Province)
                .SingleOrDefault(d => d.Id == id);

            if (district == null)
                return NotFound();

            var districtDto = Mapper.Map<District, DistrictDto>(district);

            return Ok(districtDto);
        }

        // GET api/Districts/1/Wards
        [AllowAnonymous]
        [HttpGet]
        [Route("Districts/{districtId}/Wards")]
        public IHttpActionResult GetWards(int districtId)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var listWards = _context.Wards
                .Where(w => w.DistrictId == districtId)
                .Include(w => w.District)
                .Include(w => w.District.Province)
                .ToList();

            if (!listWards.Any())
                return NotFound();

            var listWardDtos = listWards.ConvertAll(w => Mapper.Map<Ward, WardDto>(w));

            return Ok(listWardDtos);
        }

        // GET api/Wards/1
        [AllowAnonymous]
        [HttpGet]
        [Route("Wards/{id}")]
        public IHttpActionResult GetWard(int id)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var ward = _context.Wards
                .Include(w => w.District)
                .Include(w => w.District.Province)
                .SingleOrDefault(w => w.Id == id);

            if (ward == null)
                return NotFound();

            var wardDtos = Mapper.Map<Ward, WardDto>(ward);

            return Ok(wardDtos);
        }
    }
}