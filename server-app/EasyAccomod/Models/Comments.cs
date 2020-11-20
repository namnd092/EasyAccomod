using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EasyAccomod.Models
{
    public class Comments
    {
        public int Id { get; set; }

        [Required] public Renter Renter { get; set; }

        [Required] public RoomRentalPost RoomRentalPost { get; set; }

        [Required] public string Content { get; set; }

        public string Status { get; set; }

        [Required] public DateTime Time { get; set; }
    }
}