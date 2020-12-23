using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Principal;
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

    public class ListSimplePost
    {
        public IEnumerable<SimplePostDto> SimplePostDtos { get; set; }
        public int MaxPage { get; set; }
    }

    public class AdminSimplePostDto
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string DateAdded { get; set; }

        public string OwnerName { get; set; }

        public string OwnerEmail { get; set; }

        public string Status { get; set; }
    }

    public class ListAdminSimplePost
    {
        public IEnumerable<AdminSimplePostDto> SimplePostDtos { get; set; }

        public int MaxPage { get; set; }
    }

    public class OwnerSimplePostDto
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public DateTime DateExpired { get; set; }

        public int AccommodationId { get; set; }

        public bool AccommodationWasRented { get; set; }

        public string Status { get; set; }

        public AddressDto Address { get; set; }

        public int Likes { get; set; }

        public int Views { get; set; }
    }

    public class ListOwnerSimplePost
    {
        public IEnumerable<OwnerSimplePostDto> OwnerSimplePostDtos { get; set; }

        public int MaxPage { get; set; }
    }
}