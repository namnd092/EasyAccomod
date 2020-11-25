using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using EasyAccomod.Models.AddressModel;

namespace EasyAccomod.Dtos
{
    public class DistrictDto
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public ProvinceDto Province { get; set; }

        public byte ProvinceId { get; set; }
    }
}