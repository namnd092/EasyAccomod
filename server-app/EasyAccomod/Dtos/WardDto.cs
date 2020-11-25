using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using EasyAccomod.Models.AddressModel;

namespace EasyAccomod.Dtos
{
    public class WardDto
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public DistrictDto District { get; set; }

        [Required]
        public int DistrictId { get; set; }
    }
}