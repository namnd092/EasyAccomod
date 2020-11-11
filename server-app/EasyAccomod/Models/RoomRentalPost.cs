using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EasyAccomod.Models
{
    public class RoomRentalPost
    {
        [Required] public int Id { get; set; }

        [Required] public DateTime DateAdded { get; set; }

        public DateTime? DateExpired { get; set; }

        public int Views { get; set; }

        public int Likes { get; set; }

        [Required] public Accommodation Accommodation { get; set; }
    }
}