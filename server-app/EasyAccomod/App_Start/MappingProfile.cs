using AutoMapper;
using EasyAccomod.Dtos;
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

            // Dto to Domain
            Mapper.CreateMap<DistrictDto, District>();
            Mapper.CreateMap<ProvinceDto, Province>();
            Mapper.CreateMap<WardDto, Ward>();
        }
    }
}