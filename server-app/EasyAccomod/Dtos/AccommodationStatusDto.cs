using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EasyAccomod.Dtos
{
    public class AccommodationStatusDto
    {
        public byte Id { get; set; }

        [Required]
        public string Name { get; set; }
    }

    public class SetAccommodationStatusDto
    {
        [Required]
        public int? AccommodationId { get; set; }

        [Required]
        public bool? WasRented { get; set; }
    }
}