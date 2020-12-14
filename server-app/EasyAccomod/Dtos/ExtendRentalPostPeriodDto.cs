using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using EasyAccomod.Models;

namespace EasyAccomod.Dtos
{
    public class ExtendRentalPostPeriodDto
    {
        public int Id { get; set; }

        [Required]
        public int AccommodationRentalPostId { get; set; }

        [Required]
        [Range(1, 365)]
        public int ExtendPeriod { get; set; }
    }
}