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

        [Required]
        [StringLength(255)]
        public string Name { get; set; }

        [Required]
        [StringLength(12)]
        public string Identification { get; set; }

        [Required]
        [StringLength(255)]
        public string Address { get; set; }

        [Required]
        [RegularExpression(@"^0[1-9]{9}$")]
        public string Phone { get; set; }

        [Required]
        [RegularExpression(@"^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$")]
        public string Email { get; set; }

        public string AccountId { get; set; }
    }
}