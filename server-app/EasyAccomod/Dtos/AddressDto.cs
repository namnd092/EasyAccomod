using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using EasyAccomod.Models.AddressModel;

namespace EasyAccomod.Dtos
{
    public class AddressDto
    {
        public int Id { get; set; }

        public ProvinceDto Province { get; set; }

        [Required]
        public byte ProvinceId { get; set; }

        public DistrictDto District { get; set; }

        [Required]
        public int DistrictId { get; set; }

        public WardDto Ward { get; set; }

        [Required]
        public int WardId { get; set; }

        [Required]
        public string Street { get; set; }

        public string PublicLocationNearby { get; set; }
    }
}