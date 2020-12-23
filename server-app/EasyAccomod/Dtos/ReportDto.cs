using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using EasyAccomod.Models;

namespace EasyAccomod.Dtos
{
    public class ReportDto
    {
        public int Id { get; set; }

        public int RenterId { get; set; }

        public string RenterName { get; set; }

        [Required]
        public int? AccommodationRentalPostId { get; set; }

        public string PostTitle { get; set; }

        [Required] public string Content { get; set; }

        public DateTime Time { get; set; }

        public bool IsSolved { get; set; }
    }

    public class ReportId
    {
        [Required]
        public int? Id { get; set; }
    }
}