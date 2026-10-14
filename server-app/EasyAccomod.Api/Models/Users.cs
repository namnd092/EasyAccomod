using System.ComponentModel.DataAnnotations;

namespace EasyAccomod.Api.Models;

public class Admin
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    [Required]
    public string Email { get; set; }

    [Required]
    [StringLength(450)]
    public string AccountId { get; set; }
}

public class Owner
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    [Required]
    public string Identification { get; set; }

    [Required]
    public string Address { get; set; }

    [Required]
    public string Phone { get; set; }

    [Required]
    public string Email { get; set; }

    [Required]
    [StringLength(450)]
    public string AccountId { get; set; }
}

public class Renter
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    [Required]
    public string Email { get; set; }

    [Required]
    [StringLength(450)]
    public string AccountId { get; set; }
}

public class EditInfoRequest
{
    public int Id { get; set; }

    public Owner Owner { get; set; }

    public int OwnerId { get; set; }

    public bool CanEditInfo { get; set; }
}
