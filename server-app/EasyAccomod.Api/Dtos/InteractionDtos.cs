using System.ComponentModel.DataAnnotations;

namespace EasyAccomod.Api.Dtos;

public class CommentDto
{
    public int Id { get; set; }

    public int RenterId { get; set; }

    public string RenterName { get; set; }

    [Required]
    public int? AccommodationRentalPostId { get; set; }

    [Required]
    [Range(1, 5)]
    public byte? Rate { get; set; }

    [Required]
    [StringLength(1000)]
    public string Content { get; set; }

    public bool IsApproved { get; set; }

    public DateTime Time { get; set; }
}

public class ListCommentsDto
{
    public IEnumerable<CommentDto> ListCommentDtos { get; set; }

    public int MaxPage { get; set; }
}

public class LikeDto
{
    public int Id { get; set; }

    public int RenterId { get; set; }

    public string RenterName { get; set; }

    [Required]
    public int? AccommodationRentalPostId { get; set; }

    public DateTime Time { get; set; }
}

public class ReportDto
{
    public int Id { get; set; }

    public int RenterId { get; set; }

    public string RenterName { get; set; }

    [Required]
    public int? AccommodationRentalPostId { get; set; }

    public string PostTitle { get; set; }

    [Required]
    [StringLength(1000)]
    public string Content { get; set; }

    public DateTime Time { get; set; }

    public bool IsSolved { get; set; }
}

public class ExtendRentalPostPeriodDto
{
    public int Id { get; set; }

    [Required]
    public int? AccommodationRentalPostId { get; set; }

    [Required]
    [Range(1, 365)]
    public int? ExtendPeriod { get; set; }
}

public class RentalPostStatusDto
{
    [Required]
    public byte? Id { get; set; }

    [Required]
    public int? PostId { get; set; }

    public string Name { get; set; }
}

public class CommentId
{
    [Required]
    public int? Id { get; set; }
}

public class ListReportsDto
{
    public IEnumerable<ReportDto> Reports { get; set; }

    public int MaxPage { get; set; }
}

public class ReportId
{
    [Required]
    public int? Id { get; set; }
}

public class ExtendId
{
    [Required]
    public int? Id { get; set; }
}

public class NotificationId
{
    [Required]
    public int? Id { get; set; }
}
