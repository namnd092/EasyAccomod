using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EasyAccomod.Api.Models;

public class Province
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public byte Id { get; set; }

    [Required]
    public string Name { get; set; }
}

public class District
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    public Province Province { get; set; }

    public byte ProvinceId { get; set; }
}

public class Ward
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    public District District { get; set; }

    public int DistrictId { get; set; }
}

public class Address
{
    public int Id { get; set; }

    public Province Province { get; set; }

    public byte ProvinceId { get; set; }

    public District District { get; set; }

    public int DistrictId { get; set; }

    public Ward Ward { get; set; }

    public int WardId { get; set; }

    [Required]
    public string Street { get; set; }

    public string PublicLocationNearby { get; set; }
}
