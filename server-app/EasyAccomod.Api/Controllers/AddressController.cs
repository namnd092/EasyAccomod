using EasyAccomod.Api.Data;
using EasyAccomod.Api.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EasyAccomod.Api.Controllers;

[AllowAnonymous]
[Route("api")]
public class AddressController : ApiControllerBase
{
    private readonly ApplicationDbContext _context;

    public AddressController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET api/Provinces
    [HttpGet("Provinces")]
    public async Task<IActionResult> GetProvinces()
    {
        var provinces = await _context.Provinces.AsNoTracking().ToListAsync();
        return Ok(provinces.Select(p => p.ToDto()));
    }

    // GET api/Provinces/1
    [HttpGet("Provinces/{id}")]
    public async Task<IActionResult> GetProvince(byte id)
    {
        var province = await _context.Provinces.AsNoTracking().SingleOrDefaultAsync(p => p.Id == id);
        if (province == null)
            return NotFound();

        return Ok(province.ToDto());
    }

    // GET api/Provinces/1/Districts
    [HttpGet("Provinces/{provinceId}/Districts")]
    public async Task<IActionResult> GetDistricts(byte provinceId)
    {
        var districts = await _context.Districts
            .AsNoTracking()
            .Where(d => d.ProvinceId == provinceId)
            .Include(d => d.Province)
            .ToListAsync();

        if (districts.Count == 0)
            return NotFound();

        return Ok(districts.Select(d => d.ToDto()));
    }

    // GET api/Districts/1
    [HttpGet("Districts/{id}")]
    public async Task<IActionResult> GetDistrict(int id)
    {
        var district = await _context.Districts
            .AsNoTracking()
            .Include(d => d.Province)
            .SingleOrDefaultAsync(d => d.Id == id);

        if (district == null)
            return NotFound();

        return Ok(district.ToDto());
    }

    // GET api/Districts/1/Wards
    [HttpGet("Districts/{districtId}/Wards")]
    public async Task<IActionResult> GetWards(int districtId)
    {
        var wards = await _context.Wards
            .AsNoTracking()
            .Where(w => w.DistrictId == districtId)
            .Include(w => w.District.Province)
            .ToListAsync();

        if (wards.Count == 0)
            return NotFound();

        return Ok(wards.Select(w => w.ToDto()));
    }

    // GET api/Wards/1
    [HttpGet("Wards/{id}")]
    public async Task<IActionResult> GetWard(int id)
    {
        var ward = await _context.Wards
            .AsNoTracking()
            .Include(w => w.District.Province)
            .SingleOrDefaultAsync(w => w.Id == id);

        if (ward == null)
            return NotFound();

        return Ok(ward.ToDto());
    }
}
