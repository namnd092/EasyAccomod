using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using EasyAccomod.Models.AddressModel;
using Newtonsoft.Json;

namespace EasyAccomod.Models
{
    public class Accommodation
    {
        public int Id { get; set; }

        public Address Address { get; set; }

        [Required]
        public int AddressId { get; set; }

        public AccommodationType AccommodationType { get; set; }

        [Required]
        public int AccommodationTypeId { get; set; }

        [Required] public int RoomQuantity { get; set; }

        public AccommodationPaymentType PaymentType { get; set; }

        public byte PaymentTypeId { get; set; }

        public string Price { get; set; }

        public RoomAreaRange RoomAreaRange { get; set; }

        public byte RoomAreaRangeId { get; set; }

        public bool LiveWithOwner { get; set; }

        [Required] public bool HaveClosedBathroom { get; set; }

        [Required] public bool HaveWaterHeater { get; set; }

        public KitchenType KitchenType { get; set; }

        [Required]
        public byte KitchenTypeId { get; set; }

        [Required] public bool HaveAirConditioner { get; set; }

        [Required] public bool HaveBalcony { get; set; }

        [Required] public string ElectricityPrice { get; set; }

        [Required] public string WaterPrice { get; set; }

        public string RoomOptions { get; set; }

        public Owner Owner { get; set; }

        [Required]
        public int OwnerId { get; set; }

        public AccommodationStatus Status { get; set; }

        [Required]
        public byte StatusId { get; set; }
    }
}