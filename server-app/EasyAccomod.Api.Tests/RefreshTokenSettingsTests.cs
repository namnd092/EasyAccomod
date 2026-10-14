using EasyAccomod.Api.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace EasyAccomod.Api.Tests;

public class RefreshTokenSettingsTests
{
    private static IConfiguration Config(params (string Key, string Value)[] values) =>
        new ConfigurationBuilder()
            .AddInMemoryCollection(values.ToDictionary(v => v.Key, v => v.Value))
            .Build();

    [Fact]
    public void Defaults_are_strict_and_secure_outside_development()
    {
        var settings = RefreshTokenSettings.Load(Config(), isDevelopment: false);

        Assert.Equal(SameSiteMode.Strict, settings.SameSite);
        Assert.True(settings.Secure);
        Assert.Equal(10, settings.ReuseGraceSeconds);
    }

    [Fact]
    public void Development_defaults_to_a_cookie_that_is_not_secure()
    {
        Assert.False(RefreshTokenSettings.Load(Config(), isDevelopment: true).Secure);
    }

    [Fact]
    public void Settings_can_be_overridden()
    {
        var settings = RefreshTokenSettings.Load(Config(
            ("Auth:RefreshCookieSameSite", "None"),
            ("Auth:RefreshCookieSecure", "true"),
            ("Auth:RefreshReuseGraceSeconds", "0")), isDevelopment: true);

        Assert.Equal(SameSiteMode.None, settings.SameSite);
        Assert.True(settings.Secure);
        Assert.Equal(0, settings.ReuseGraceSeconds);
    }

    [Fact]
    public void SameSite_none_without_secure_is_refused()
    {
        var error = Assert.Throws<InvalidOperationException>(() => RefreshTokenSettings.Load(Config(
            ("Auth:RefreshCookieSameSite", "None"),
            ("Auth:RefreshCookieSecure", "false")), isDevelopment: false));
        Assert.Contains("requires Auth:RefreshCookieSecure=true", error.Message);

        // Development has no Secure default, so SameSite=None needs Secure spelled out there too.
        Assert.Throws<InvalidOperationException>(() => RefreshTokenSettings.Load(Config(
            ("Auth:RefreshCookieSameSite", "None")), isDevelopment: true));
    }

    [Theory]
    [InlineData("Auth:RefreshCookieSameSite", "Sideways")]
    [InlineData("Auth:RefreshCookieSameSite", "Unspecified")]
    [InlineData("Auth:RefreshCookieSecure", "maybe")]
    [InlineData("Auth:RefreshReuseGraceSeconds", "-1")]
    public void Invalid_values_are_refused(string key, string value)
    {
        Assert.Throws<InvalidOperationException>(() => RefreshTokenSettings.Load(Config((key, value)), isDevelopment: false));
    }
}
