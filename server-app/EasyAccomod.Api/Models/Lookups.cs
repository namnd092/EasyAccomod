using System.ComponentModel.DataAnnotations;

namespace EasyAccomod.Api.Models;

public class AccommodationType
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }
}

public class KitchenType
{
    public byte Id { get; set; }

    [Required]
    public string Name { get; set; }
}

public class AccommodationPaymentType
{
    public byte Id { get; set; }

    [Required]
    public string Name { get; set; }
}

public class RoomAreaRange
{
    public byte Id { get; set; }

    [Required]
    public string Range { get; set; }
}

public class AccommodationStatus
{
    public byte Id { get; set; }

    [Required]
    public string Name { get; set; }
}

public static class AccommodationStatusName
{
    public const string Rented = "Đã cho thuê";
    public const string NotRented = "Chưa cho thuê";
}

public class RentalPostStatus
{
    public byte Id { get; set; }

    [Required]
    public string Name { get; set; }
}

public static class RentalPostStatusName
{
    public const string PendingApproval = "Đang chờ duyệt";
    public const string Approved = "Được duyệt";
    public const string Rejected = "Không được duyệt";
    public const string Editing = "Đang chỉnh sửa";
    public const string WaitingEditPermission = "Đang chờ quyền chỉnh sửa";
}
