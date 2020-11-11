using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using Microsoft.Owin.BuilderProperties;

namespace EasyAccomod.Models
{
    public class Owner
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