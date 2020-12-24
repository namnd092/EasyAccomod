using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EasyAccomod.Models
{
    public class Notification
    {
        public int Id { get; set; }

        [Required]
        public string AccountId { get; set; }

        [Required]
        public string Content { get; set; }

        [Required]
        public int RentalPostId { get; set; }

        [Required]
        public DateTime Time { get; set; }

        [Required]
        public bool HasBeenChecked { get; set; }
    }

    public class NotificationId
    {
        [Required]
        public int? Id { get; set; }
    }
}