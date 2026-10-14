using System.Net;

namespace EasyAccomod.Api.Auth;

public static class ClientAddress
{
    // Rate-limit partition for a client. An IPv6 user typically controls a whole /64, so the
    // address is cut to its first 64 bits; otherwise rotating the low bits would dodge the limit.
    public static string PartitionKey(IPAddress address)
    {
        if (address == null)
            return "unknown";

        if (address.IsIPv4MappedToIPv6)
            address = address.MapToIPv4();

        if (address.AddressFamily != System.Net.Sockets.AddressFamily.InterNetworkV6)
            return address.ToString();

        return Convert.ToHexString(address.GetAddressBytes().AsSpan(0, 8)) + "::/64";
    }
}
