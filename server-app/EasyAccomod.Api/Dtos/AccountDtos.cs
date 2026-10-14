using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EasyAccomod.Api.Dtos;

public class CreateTokenBindingModel
{
    [Required]
    public string UserName { get; set; }

    [Required]
    [DataType(DataType.Password)]
    public string Password { get; set; }
}

public class RegisterBindingModel
{
    [Required]
    [StringLength(255)]
    public string Name { get; set; }

    [Required]
    [StringLength(255)]
    public string UserName { get; set; }

    [Required]
    [RegularExpression(@"^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$")]
    public string Email { get; set; }

    [Required]
    [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
    [DataType(DataType.Password)]
    public string Password { get; set; }

    [DataType(DataType.Password)]
    [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
    public string ConfirmPassword { get; set; }
}

public class OwnerRegisterBindingModel : RegisterBindingModel
{
    [Required]
    [StringLength(12)]
    public string Identification { get; set; }

    [Required]
    [StringLength(255)]
    public string Address { get; set; }

    [Required]
    [RegularExpression(@"^0[1-9]{1}[0-9]{8}$")]
    public string Phone { get; set; }
}

public class SetRoleBindingModel
{
    [Required]
    public string AccountId { get; set; }
}

public class ResolveEditInfoBindingModel
{
    [Required]
    public int? OwnerId { get; set; }

    public bool CanEditInfo { get; set; }
}

public class InfoViewModel
{
    public string AccountId { get; set; }

    public int UserId { get; set; }

    public string Identification { get; set; }

    public string Address { get; set; }

    public string Phone { get; set; }

    public string Email { get; set; }

    public string Name { get; set; }

    public string Role { get; set; }
}

// Property names are pinned to the snake_case shape the OWIN /Token endpoint used to return.
public class CreateTokenViewModel
{
    [JsonPropertyName("access_token")]
    public string AccessToken { get; set; }

    [JsonPropertyName("token_type")]
    public string TokenType { get; set; }

    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; set; }

    [JsonPropertyName("username")]
    public string UserName { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("account_id")]
    public string AccountId { get; set; }

    [JsonPropertyName("user_id")]
    public int UserId { get; set; }

    [JsonPropertyName("role")]
    public string Role { get; set; }
}
