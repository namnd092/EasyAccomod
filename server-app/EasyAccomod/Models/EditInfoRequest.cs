using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EasyAccomod.Models
{
    public class EditInfoRequest
    {
        public int Id { get; set; }

        public Owner Owner { get; set; }

        [Required]
        public int OwnerId { get; set; }

        [Required]
        public bool CanEditInfo { get; set; }
    }
}