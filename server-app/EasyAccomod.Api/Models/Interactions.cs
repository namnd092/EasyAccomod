using System.ComponentModel.DataAnnotations;

namespace EasyAccomod.Api.Models;

public class Comment
{
    public int Id { get; set; }

    public Renter Renter { get; set; }

    public int RenterId { get; set; }

    public AccommodationRentalPost AccommodationRentalPost { get; set; }

    public int AccommodationRentalPostId { get; set; }

    [Range(1, 5)]
    public byte Rate { get; set; }

    [Required]
    public string Content { get; set; }

    public bool IsApproved { get; set; }

    public DateTime Time { get; set; }
}

public class Like
{
    public int Id { get; set; }

    public Renter Renter { get; set; }

    public int RenterId { get; set; }

    public AccommodationRentalPost AccommodationRentalPost { get; set; }

    public int AccommodationRentalPostId { get; set; }

    public DateTime Time { get; set; }
}

public class View
{
    public int Id { get; set; }

    public AccommodationRentalPost AccommodationRentalPost { get; set; }

    public int AccommodationRentalPostId { get; set; }

    // Who looked: "u:<account id>" for a signed-in user, "ip:<client address>" otherwise.
    // Null on views recorded before viewers were tracked.
    [MaxLength(64)]
    public string ViewerKey { get; set; }

    public DateTime Time { get; set; }
}

public class Report
{
    public int Id { get; set; }

    public Renter Renter { get; set; }

    public int RenterId { get; set; }

    public AccommodationRentalPost AccommodationRentalPost { get; set; }

    public int AccommodationRentalPostId { get; set; }

    [Required]
    public string Content { get; set; }

    public DateTime Time { get; set; }

    public bool IsSolved { get; set; }
}

public class Notification
{
    public int Id { get; set; }

    [Required]
    public string AccountId { get; set; }

    [Required]
    public string Content { get; set; }

    public int RentalPostId { get; set; }

    public DateTime Time { get; set; }

    public bool HasBeenChecked { get; set; }
}

public class ExtendRentalPostPeriod
{
    public int Id { get; set; }

    public int AccommodationRentalPostId { get; set; }

    public AccommodationRentalPost AccommodationRentalPost { get; set; }

    public int ExtendPeriod { get; set; }
}
