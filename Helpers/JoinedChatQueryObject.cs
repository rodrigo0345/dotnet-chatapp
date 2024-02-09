
using ccnd.Interfaces;
using System.Diagnostics.CodeAnalysis;

namespace chatapp.Helpers
{
    public class JoinedChatQueryObject
    {
        // IsAdmin, IsBanned, IsAccepted, UserId
        public string? FilterBy { get; set; } = null;
        public string? FilterValue { get; set; } = null;
        public bool IsDescending { get; set; } = true;
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}