using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace EasyAccomod.Models
{
    public class Accommodation
    {
        [Required] public int Id { get; set; }

        [Required] public string Address { get; set; }

        public string PublicLocationsNearby { get; set; }

        [Required] public string RoomType { get; set; }

        [Required] public int RoomQuantity { get; set; }

        public string RoomPrice { get; set; }

        public string RoomArea { get; set; }

        public bool LiveWithOwner { get; set; }

        [Required] public bool HaveClosedBathroom { get; set; }

        [Required] public bool HaveWaterHeater { get; set; }

        [Required] public string Kitchen { get; set; }

        [Required] public bool HaveAirConditioner { get; set; }

        [Required] public bool HaveBalcony { get; set; }

        [Required] public int ElectricityPrice { get; set; }

        [Required] public int WaterPrice { get; set; }

        public string RoomOptions { get; set; }

        [Required] public Owner Owner { get; set; }

        [Required] public string Status { get; set; }
    }
}