using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EasyAccomod.Models
{
    public class RentalPostStatus
    {
        public byte Id { get; set; }

        [Required]
        public string Name { get; set; }
    }

    public class RentalPostStatusName
    {
        public const string PendingApproval = "Đang chờ duyệt";
        public const string Approved = "Được duyệt";
        public const string Rejected = "Không được duyệt";
    }
}