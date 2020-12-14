using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EasyAccomod.Models
{
    public class ExtendRentalPostPeriod
    {
        public int Id { get; set; }

        [Required]
        public int AccommodationRentalPostId { get; set; }

        public AccommodationRentalPost AccommodationRentalPost { get; set; }

        [Required]
        public int ExtendPeriod { get; set; }
    }
}