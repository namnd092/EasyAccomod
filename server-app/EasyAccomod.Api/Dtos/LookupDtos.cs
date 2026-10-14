using System.ComponentModel.DataAnnotations;

namespace EasyAccomod.Api.Dtos;

public class AccommodationTypeDto
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }
}

public class AccommodationPaymentTypeDto
{
    public byte Id { get; set; }

    [Required]
    public string Name { get; set; }
}

public class KitchenTypeDto
{
    public byte Id { get; set; }

    [Required]
    public string Name { get; set; }
}

public class RoomAreaRangeDto
{
    public byte Id { get; set; }

    [Required]
    public string Range { get; set; }
}

public class AccommodationStatusDto
{
    public byte Id { get; set; }

    [Required]
    public string Name { get; set; }
}

public class SetAccommodationStatusDto
{
    [Required]
    public int? AccommodationId { get; set; }

    [Required]
    public bool? WasRented { get; set; }
}
