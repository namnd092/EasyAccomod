using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using EasyAccomod.Models;

namespace EasyAccomod.Dtos
{
    public class SimplePostDto
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Content { get; set; }

        public ICollection<AccommodationPictureDto> Pictures { get; set; }

        public DateTime DateAdded { get; set; }

        public string AccommodationPrice { get; set; }

        public string RoomArea { get; set; }

        public string AccommodationProvince { get; set; }

        public double Rate { get; set; }
    }
}