using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EasyAccomod.Models
{
    public class AccommodationPicture
    {
        public int Id { get; set; }

        [Required] public string PictureLink { get; set; }

        [Required] public Accommodation Accommodation { get; set; }
    }
}