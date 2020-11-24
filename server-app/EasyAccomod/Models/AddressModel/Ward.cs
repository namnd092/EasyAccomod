using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EasyAccomod.Models.AddressModel
{
    public class Ward
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public District District { get; set; }

        [Required]
        public int DistrictId { get; set; }
    }
}