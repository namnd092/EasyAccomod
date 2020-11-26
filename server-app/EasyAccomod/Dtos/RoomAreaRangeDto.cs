using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EasyAccomod.Dtos
{
    public class RoomAreaRangeDto
    {
        public byte Id { get; set; }

        [Required]
        public string Range { get; set; }
    }
}