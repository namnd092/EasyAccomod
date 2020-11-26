using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EasyAccomod.Models
{
    public class View
    {
        public int Id { get; set; }

        public AccommodationRentalPost AccommodationRentalPost { get; set; }

        [Required]
        public int AccommodationRentalPostId { get; set; }

        [Required] public DateTime Time { get; set; }
    }
}