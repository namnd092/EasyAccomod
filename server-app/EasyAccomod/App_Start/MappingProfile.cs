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
        }
    }
}