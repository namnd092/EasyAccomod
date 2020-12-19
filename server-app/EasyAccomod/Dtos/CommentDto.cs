using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using EasyAccomod.Models;

namespace EasyAccomod.Dtos
{
    public class CommentDto
    {
        public int Id { get; set; }

        public int RenterId { get; set; }

        public string RenterName { get; set; }

        [Required]
        public int? AccommodationRentalPostId { get; set; }

        [Required]
        [Range(1, 5)]
        public byte? Rate { get; set; }

        [Required] public string Content { get; set; }

        public bool IsApproved { get; set; }

        public DateTime Time { get; set; }
    }

    public class ListCommentsDto
    {
        public IEnumerable<CommentDto> ListCommentDtos { get; set; }

        public int MaxPage { get; set; }
    }
}