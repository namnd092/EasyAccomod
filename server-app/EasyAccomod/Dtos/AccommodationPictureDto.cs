using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using EasyAccomod.Models;

namespace EasyAccomod.Dtos
{
    public class AccommodationPictureDto
    {
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string PictureLink { get; set; }

        [Required]
        public int AccommodationRentalPostId { get; set; }
    }
}