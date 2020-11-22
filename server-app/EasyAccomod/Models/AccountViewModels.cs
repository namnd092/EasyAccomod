using System;
using System.Collections.Generic;

namespace EasyAccomod.Models
{
    // Models returned by AccountController actions.

    public class CreateTokenViewModel
    {
        public string access_token { get; set; }

        public string token_type { get; set; }

        public int expires_in { get; set; }

        public string username { get; set; }

        public string account_id { get; set; }

        public int user_id { get; set; }

        public string role { get; set; }
    }

    public class ExternalLoginViewModel
    {
        public string Name { get; set; }

        public string Url { get; set; }

        public string State { get; set; }
    }

    public class ManageInfoViewModel
    {
        public string LocalLoginProvider { get; set; }

        public string Email { get; set; }

        public IEnumerable<UserLoginInfoViewModel> Logins { get; set; }

        public IEnumerable<ExternalLoginViewModel> ExternalLoginProviders { get; set; }
    }

    public class UserInfoViewModel
    {
        public string Email { get; set; }

        public bool HasRegistered { get; set; }

        public string LoginProvider { get; set; }
    }

    public class UserLoginInfoViewModel
    {
        public string LoginProvider { get; set; }

        public string ProviderKey { get; set; }
    }
}