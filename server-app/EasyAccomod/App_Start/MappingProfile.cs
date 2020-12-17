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
            Mapper.CreateMap<AccommodationRentalPost, AccommodationRentalPostDto>();
            Mapper.CreateMap<AccommodationPicture, AccommodationPictureDto>();

            Mapper.CreateMap<ExtendRentalPostPeriod, ExtendRentalPostPeriodDto>();

            Mapper.CreateMap<Like, LikeDto>()
                .ForMember(l => l.RenterName, act => act.MapFrom(l => l.Renter.Name));
            Mapper.CreateMap<Comment, CommentDto>()
                .ForMember(c => c.RenterName, act => act.MapFrom(c => c.Renter.Name));
            Mapper.CreateMap<Report, ReportDto>()
                .ForMember(r => r.RenterName, act => act.MapFrom(r => r.Renter.Name));

            // Dto to Domain
            Mapper.CreateMap<DistrictDto, District>();
            Mapper.CreateMap<ProvinceDto, Province>();
            Mapper.CreateMap<WardDto, Ward>();

            Mapper.CreateMap<AccommodationDto, Accommodation>()
                .ForMember(a => a.Id, opt => opt.Ignore());
            Mapper.CreateMap<AddressDto, Address>()
                .ForMember(a => a.Id, opt => opt.Ignore());
            Mapper.CreateMap<OwnerDto, Owner>()
                .ForMember(o => o.Id, opt => opt.Ignore());
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