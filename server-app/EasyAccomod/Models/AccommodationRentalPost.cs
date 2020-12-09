using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EasyAccomod.Models
{
    public class AccommodationRentalPost
    {
        [Required] public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Content { get; set; }

        [Required] public DateTime DateAdded { get; set; }

        [Required] public DateTime DateExpired { get; set; }

        public ICollection<AccommodationPicture> AccommodationPictures { get; set; }

        public Accommodation Accommodation { get; set; }

        [Required]
        public int AccommodationId { get; set; }

        public RentalPostStatus Status { get; set; }

        [Required]
        public byte StatusId { get; set; }
    }
}