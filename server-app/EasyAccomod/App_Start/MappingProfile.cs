using AutoMapper;
using EasyAccomod.Dtos;
using EasyAccomod.Models;
using EasyAccomod.Models.AddressModel;

namespace Vidly.App_Start
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Domain to Dto
            Mapper.CreateMap<District, DistrictDto>();
            Mapper.CreateMap<Province, ProvinceDto>();
            Mapper.CreateMap<Ward, WardDto>();

            Mapper.CreateMap<Accommodation, AccommodationDto>();
            Mapper.CreateMap<Address, AddressDto>();
            Mapper.CreateMap<AccommodationType, AccommodationTypeDto>();
            Mapper.CreateMap<AccommodationPaymentType, AccommodationPaymentTypeDto>();
            Mapper.CreateMap<AccommodationStatus, AccommodationStatusDto>();
            Mapper.CreateMap<RoomAreaRange, RoomAreaRangeDto>();
            Mapper.CreateMap<KitchenType, KitchenTypeDto>();
            Mapper.CreateMap<Owner, OwnerDto>();
            Mapper.CreateMap<AccommodationPicture, AccommodationPictureDto>();

            Mapper.CreateMap<AccommodationRentalPost, AccommodationRentalPostDto>();
            Mapper.CreateMap<AccommodationRentalPost, SimplePostDto>()
                .ForMember(p => p.AccommodationPrice,
                    act => act.MapFrom(p => p.Accommodation.Price + "đ/" + p.Accommodation.PaymentType.Name))
                .ForMember(p => p.AccommodationProvince, act => act.MapFrom(p => p.Accommodation.Address.Province.Name))
                .ForMember(p => p.Pictures, act => act.MapFrom(p => p.AccommodationPictures))
                .ForMember(p => p.RoomArea, act => act.MapFrom(p => p.Accommodation.RoomAreaRange.Range));
            Mapper.CreateMap<AccommodationRentalPost, AdminSimplePostDto>()
                .ForMember(p => p.OwnerName, act => act.MapFrom(p => p.Accommodation.Owner.Name))
                .ForMember(p => p.OwnerEmail, act => act.MapFrom(p => p.Accommodation.Owner.Email))
                .ForMember(p => p.Status, act => act.MapFrom(p => p.Status.Name))
                .ForMember(p => p.DateAdded, act => act.MapFrom(p => p.DateAdded.ToShortDateString()));
            Mapper.CreateMap<AccommodationRentalPost, OwnerSimplePostDto>()
                .ForMember(p => p.AccommodationWasRented, act => act.MapFrom(p => p.Accommodation.Status.Name == AccommodationStatusName.Rented))
                .ForMember(p => p.Address, act => act.MapFrom(p => p.Accommodation.Address))
                .ForMember(p => p.Status, act => act.MapFrom(p => p.Status.Name));

            Mapper.CreateMap<ExtendRentalPostPeriod, ExtendRentalPostPeriodDto>();

            Mapper.CreateMap<Like, LikeDto>()
                .ForMember(l => l.RenterName, act => act.MapFrom(l => l.Renter.Name));
            Mapper.CreateMap<Comment, CommentDto>()
                .ForMember(c => c.RenterName, act => act.MapFrom(c => c.Renter.Name));
            Mapper.CreateMap<Report, ReportDto>()
                .ForMember(r => r.RenterName, act => act.MapFrom(r => r.Renter.Name))
                .ForMember(r => r.PostTitle, act => act.MapFrom(p => p.AccommodationRentalPost.Title));

            // Dto to Domain
            Mapper.CreateMap<DistrictDto, District>();
            Mapper.CreateMap<ProvinceDto, Province>();
            Mapper.CreateMap<WardDto, Ward>();

            Mapper.CreateMap<AccommodationDto, Accommodation>()
                .ForMember(a => a.Id, opt => opt.Ignore());
            Mapper.CreateMap<AddressDto, Address>()
                .ForMember(a => a.Id, opt => opt.Ignore());
            Mapper.CreateMap<OwnerDto, Owner>()
                .ForMember(o => o.Id, opt => opt.Ignore())
                .ForMember(o => o.AccountId, opt => opt.Ignore());
            Mapper.CreateMap<AccommodationRentalPostDto, AccommodationRentalPost>()
                .ForMember(p => p.Id, opt => opt.Ignore());
            Mapper.CreateMap<AccommodationPictureDto, AccommodationPicture>()
                .ForMember(p => p.Id, opt => opt.Ignore());

            Mapper.CreateMap<ExtendRentalPostPeriodDto, ExtendRentalPostPeriod>()
                .ForMember(e => e.Id, opt => opt.Ignore());

            Mapper.CreateMap<LikeDto, Like>()
                .ForMember(l => l.Id, opt => opt.Ignore());
            Mapper.CreateMap<CommentDto, Comment>()
                .ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<ReportDto, Report>()
                .ForMember(r => r.Id, opt => opt.Ignore());
        }
    }
}