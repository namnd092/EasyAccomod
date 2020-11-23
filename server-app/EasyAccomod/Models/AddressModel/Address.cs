using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EasyAccomod.Models.AddressModel
{
    public class Address
    {
        public int Id { get; set; }

        public Province Province { get; set; }

        public District District { get; set; }

        public Ward Ward { get; set; }

        public string Street { get; set; }

        [Required]
        public Accommodation Accommodation { get; set; }
    }
}