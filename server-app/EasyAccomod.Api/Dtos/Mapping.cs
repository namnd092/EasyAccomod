using EasyAccomod.Api.Models;

namespace EasyAccomod.Api.Dtos;

// Hand-written replacement for the AutoMapper profile of the old server.
// Navigation properties that were not loaded stay null, as AutoMapper did.
public static class Mapping
{
    public static ProvinceDto ToDto(this Province province) =>
        province == null ? null : new ProvinceDto { Id = province.Id, Name = province.Name };

    public static DistrictDto ToDto(this District district) =>
        district == null
            ? null
            : new DistrictDto
            {
                Id = district.Id,
                Name = district.Name,
                ProvinceId = district.ProvinceId,
                Province = district.Province.ToDto(),
            };

    public static WardDto ToDto(this Ward ward) =>
        ward == null
            ? null
            : new WardDto
            {
                Id = ward.Id,
                Name = ward.Name,
                DistrictId = ward.DistrictId,
                District = ward.District.ToDto(),
            };

    public static AddressDto ToDto(this Address address) =>
        address == null
            ? null
            : new AddressDto
            {
                Id = address.Id,
                ProvinceId = address.ProvinceId,
                Province = address.Province.ToDto(),
                DistrictId = address.DistrictId,
                District = address.District.ToDto(),
                WardId = address.WardId,
                Ward = address.Ward.ToDto(),
                Street = address.Street,
                PublicLocationNearby = address.PublicLocationNearby,
            };

    public static OwnerDto ToDto(this Owner owner) =>
        owner == null
            ? null
            : new OwnerDto
            {
                Id = owner.Id,
                Name = owner.Name,
                Identification = owner.Identification,
                Address = owner.Address,
                Phone = owner.Phone,
                Email = owner.Email,
                AccountId = owner.AccountId,
            };

    public static AccommodationPictureDto ToDto(this AccommodationPicture picture) =>
        new AccommodationPictureDto
        {
            Id = picture.Id,
            PictureLink = picture.PictureLink,
            AccommodationRentalPostId = picture.AccommodationRentalPostId,
        };

    public static AccommodationDto ToDto(this Accommodation accommodation) =>
        accommodation == null
            ? null
            : new AccommodationDto
            {
                Id = accommodation.Id,
                AddressId = accommodation.AddressId,
                Address = accommodation.Address.ToDto(),
                AccommodationTypeId = accommodation.AccommodationTypeId,
                AccommodationType = accommodation.AccommodationType == null
                    ? null
                    : new AccommodationTypeDto
                    {
                        Id = accommodation.AccommodationType.Id,
                        Name = accommodation.AccommodationType.Name,
                    },
                RoomQuantity = accommodation.RoomQuantity,
                PaymentTypeId = accommodation.PaymentTypeId,
                PaymentType = accommodation.PaymentType == null
                    ? null
                    : new AccommodationPaymentTypeDto
                    {
                        Id = accommodation.PaymentType.Id,
                        Name = accommodation.PaymentType.Name,
                    },
                Price = accommodation.Price,
                RoomAreaRangeId = accommodation.RoomAreaRangeId,
                RoomAreaRange = accommodation.RoomAreaRange == null
                    ? null
                    : new RoomAreaRangeDto
                    {
                        Id = accommodation.RoomAreaRange.Id,
                        Range = accommodation.RoomAreaRange.Range,
                    },
                LiveWithOwner = accommodation.LiveWithOwner,
                HaveClosedBathroom = accommodation.HaveClosedBathroom,
                HaveWaterHeater = accommodation.HaveWaterHeater,
                KitchenTypeId = accommodation.KitchenTypeId,
                KitchenType = accommodation.KitchenType == null
                    ? null
                    : new KitchenTypeDto
                    {
                        Id = accommodation.KitchenType.Id,
                        Name = accommodation.KitchenType.Name,
                    },
                HaveAirConditioner = accommodation.HaveAirConditioner,
                HaveBalcony = accommodation.HaveBalcony,
                IsStateElectricityPrice = accommodation.IsStateElectricityPrice,
                ElectricityPrice = accommodation.ElectricityPrice,
                IsStateWaterPrice = accommodation.IsStateWaterPrice,
                WaterPrice = accommodation.WaterPrice,
                RoomOptions = accommodation.RoomOptions,
                OwnerId = accommodation.OwnerId,
                Owner = accommodation.Owner.ToDto(),
                StatusId = accommodation.StatusId,
                Status = accommodation.Status == null
                    ? null
                    : new AccommodationStatusDto
                    {
                        Id = accommodation.Status.Id,
                        Name = accommodation.Status.Name,
                    },
            };

    public static AccommodationRentalPostDto ToDto(this AccommodationRentalPost post) =>
        new AccommodationRentalPostDto
        {
            Id = post.Id,
            Title = post.Title,
            Content = post.Content,
            DateAdded = post.DateAdded,
            DateExpired = post.DateExpired,
            AccommodationPictures = post.AccommodationPictures?.Select(p => p.ToDto()).ToList(),
            AccommodationId = post.AccommodationId,
            Accommodation = post.Accommodation.ToDto(),
            StatusId = post.StatusId,
            Status = post.Status,
        };

    public static SimplePostDto ToSimpleDto(this AccommodationRentalPost post) =>
        new SimplePostDto
        {
            Id = post.Id,
            Title = post.Title,
            Content = post.Content,
            DateAdded = post.DateAdded,
            Pictures = post.AccommodationPictures?.Select(p => p.ToDto()).ToList(),
            AccommodationPrice = post.Accommodation.Price + "đ/" + post.Accommodation.PaymentType.Name,
            AccommodationProvince = post.Accommodation.Address.Province.Name,
            RoomArea = post.Accommodation.RoomAreaRange.Range,
        };

    public static AdminSimplePostDto ToAdminSimpleDto(this AccommodationRentalPost post) =>
        new AdminSimplePostDto
        {
            Id = post.Id,
            Title = post.Title,
            DateAdded = post.DateAdded.ToString("dd/MM/yyyy"),
            OwnerName = post.Accommodation.Owner.Name,
            OwnerEmail = post.Accommodation.Owner.Email,
            Status = post.Status.Name,
        };

    public static OwnerSimplePostDto ToOwnerSimpleDto(this AccommodationRentalPost post) =>
        new OwnerSimplePostDto
        {
            Id = post.Id,
            Title = post.Title,
            DateExpired = post.DateExpired,
            AccommodationId = post.AccommodationId,
            AccommodationWasRented = post.Accommodation.Status.Name == AccommodationStatusName.Rented,
            Address = post.Accommodation.Address.ToDto(),
            Status = post.Status.Name,
        };

    public static CommentDto ToDto(this Comment comment) =>
        new CommentDto
        {
            Id = comment.Id,
            RenterId = comment.RenterId,
            RenterName = comment.Renter?.Name,
            AccommodationRentalPostId = comment.AccommodationRentalPostId,
            Rate = comment.Rate,
            Content = comment.Content,
            IsApproved = comment.IsApproved,
            Time = comment.Time,
        };

    public static ReportDto ToDto(this Report report) =>
        new ReportDto
        {
            Id = report.Id,
            RenterId = report.RenterId,
            RenterName = report.Renter?.Name,
            AccommodationRentalPostId = report.AccommodationRentalPostId,
            PostTitle = report.AccommodationRentalPost?.Title,
            Content = report.Content,
            Time = report.Time,
            IsSolved = report.IsSolved,
        };

    public static int MaxPage(int count, int limit) => (int)Math.Ceiling(1.0 * count / limit);
}
