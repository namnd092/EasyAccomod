using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using EasyAccomod.Models;

namespace EasyAccomod.Dtos
{
    public class AccommodationRentalPostDto
    {
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Title { get; set; }

        [Required]
        [StringLength(1000)]
        public string Content { get; set; }

        public DateTime DateAdded { get; set; }

        public DateTime DateExpired { get; set; }

        [Required]
        [Range(7, 365)]
        public int? TimeDisplayed { get; set; }

        [Required]
        public ICollection<AccommodationPictureDto> AccommodationPictures { get; set; }

        [Required]
        public AccommodationDto Accommodation { get; set; }

        public int AccommodationId { get; set; }

        public RentalPostStatus Status { get; set; }

        public byte StatusId { get; set; }
    }
}