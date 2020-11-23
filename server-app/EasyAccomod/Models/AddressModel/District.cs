using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EasyAccomod.Models.AddressModel
{
    public class District
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public Province Province { get; set; }
    }
}