using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EasyAccomod.Dtos
{
    public class OwnerDto
    {
        public int Id { get; set; }

        [Required] public string Name { get; set; }

        [Required] public string Identification { get; set; }

        [Required] public string Address { get; set; }

        [Required] public string Phone { get; set; }

        [Required] public string Email { get; set; }

        [Required] [StringLength(128)] public string AccountId { get; set; }
    }
}