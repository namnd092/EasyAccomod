using System.ComponentModel.DataAnnotations;

namespace EasyAccomod.Api.Models;

public class Accommodation
{
    public int Id { get; set; }

    public Address Address { get; set; }

    public int AddressId { get; set; }

    public AccommodationType AccommodationType { get; set; }

    public int AccommodationTypeId { get; set; }

    public int RoomQuantity { get; set; }

    public AccommodationPaymentType PaymentType { get; set; }

    public byte PaymentTypeId { get; set; }

    public int Price { get; set; }

    public RoomAreaRange RoomAreaRange { get; set; }

    public byte RoomAreaRangeId { get; set; }

    public bool LiveWithOwner { get; set; }

    public bool HaveClosedBathroom { get; set; }

    public bool HaveWaterHeater { get; set; }

    public KitchenType KitchenType { get; set; }

    public byte KitchenTypeId { get; set; }

    public bool HaveAirConditioner { get; set; }

    public bool HaveBalcony { get; set; }

    public bool IsStateElectricityPrice { get; set; }

    public int ElectricityPrice { get; set; }

    public bool IsStateWaterPrice { get; set; }

    public int WaterPrice { get; set; }

    public string RoomOptions { get; set; }

    public Owner Owner { get; set; }

    public int OwnerId { get; set; }

    public AccommodationStatus Status { get; set; }

    public byte StatusId { get; set; }
}

public class AccommodationRentalPost
{
    public int Id { get; set; }

    [Required]
    public string Title { get; set; }

    [Required]
    public string Content { get; set; }

    public DateTime DateAdded { get; set; }

    public DateTime DateExpired { get; set; }

    public ICollection<AccommodationPicture> AccommodationPictures { get; set; }

    public Accommodation Accommodation { get; set; }

    public int AccommodationId { get; set; }

    public RentalPostStatus Status { get; set; }

    public byte StatusId { get; set; }
}

public class AccommodationPicture
{
    public int Id { get; set; }

    [Required]
    public string PictureLink { get; set; }

    public AccommodationRentalPost AccommodationRentalPost { get; set; }

    public int AccommodationRentalPostId { get; set; }
}
