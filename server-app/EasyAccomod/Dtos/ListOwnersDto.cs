using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EasyAccomod.Dtos
{
    public class ListOwnersDto
    {
        public IEnumerable<OwnerDto> Owners { get; set; }

        public int MaxPage { get; set; }
    }
}