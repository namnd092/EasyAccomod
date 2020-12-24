using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EasyAccomod.Models
{
    // Models used as parameters to AdminController actions.

    public class SetRoleBindingModel
    {
        [Required]
        public string AccountId { get; set; }
    }
}