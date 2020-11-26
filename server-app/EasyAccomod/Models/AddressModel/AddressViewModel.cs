using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EasyAccomod.Models.AddressModel
{
    public class ProvinceViewModel
    {
        public byte Id { get; set; }

        public string Name { get; set; }

        public IEnumerable<DistrictViewModel> Huyen { get; set; }
    }

    public class DistrictViewModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public byte Tinh_id { get; set; }

        public IEnumerable<WardViewModel> Xa { get; set; }
    }

    public class WardViewModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int Huyen_id { get; set; }
    }
}