using System.ComponentModel.DataAnnotations;

namespace EasyAccomod.Api.Dtos;

public class ProvinceDto
{
    public byte Id { get; set; }

    public string Name { get; set; }
}

public class DistrictDto
{
    public int Id { get; set; }

    public string Name { get; set; }

    public ProvinceDto Province { get; set; }

    public byte ProvinceId { get; set; }
}

public class WardDto
{
    public int Id { get; set; }

    public string Name { get; set; }

    public DistrictDto District { get; set; }

    public int? DistrictId { get; set; }
}

public class AddressDto
{
    public int Id { get; set; }

    public ProvinceDto Province { get; set; }

    [Required]
    public byte? ProvinceId { get; set; }

    public DistrictDto District { get; set; }

    [Required]
    public int? DistrictId { get; set; }

    public WardDto Ward { get; set; }

    [Required]
    public int? WardId { get; set; }

    [Required]
    public string Street { get; set; }

    public string PublicLocationNearby { get; set; }
}
