using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EasyAccomod.Dtos
{
    public class RentalPostStatusDto
    {
        [Required]
        public byte? Id { get; set; }

        [Required]
        public int? PostId { get; set; }

        public string Name { get; set; }
    }
}