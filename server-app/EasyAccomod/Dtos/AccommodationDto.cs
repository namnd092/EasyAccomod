using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using EasyAccomod.Models;
using EasyAccomod.Models.AddressModel;

namespace EasyAccomod.Dtos
{
    public class AccommodationDto
    {
        public int Id { get; set; }

        public AddressDto Address { get; set; }

        [Required]
        public int AddressId { get; set; }

        public AccommodationTypeDto AccommodationType { get; set; }

        [Required]
        public int AccommodationTypeId { get; set; }

        [Required] public int RoomQuantity { get; set; }

        public AccommodationPaymentTypeDto PaymentType { get; set; }

        public byte PaymentTypeId { get; set; }

        public string Price { get; set; }

        public RoomAreaRangeDto RoomAreaRange { get; set; }

        public byte RoomAreaRangeId { get; set; }

        public bool LiveWithOwner { get; set; }

        [Required] public bool HaveClosedBathroom { get; set; }

        [Required] public bool HaveWaterHeater { get; set; }

        public KitchenTypeDto KitchenType { get; set; }

        [Required]
        public byte KitchenTypeId { get; set; }

        [Required] public bool HaveAirConditioner { get; set; }

        [Required] public bool HaveBalcony { get; set; }

        [Required] public int ElectricityPrice { get; set; }

        [Required] public int WaterPrice { get; set; }

        public string RoomOptions { get; set; }

        public OwnerDto Owner { get; set; }

        [Required]
        public int OwnerId { get; set; }

        [Required] public string Status { get; set; }
    }
}