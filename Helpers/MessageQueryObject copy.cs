using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using ccnd.Interfaces;
using chatapp.Models;

namespace chatapp.Helpers
{
    public class MessageQueryObject
    {
        public string Query { get; set; } = String.Empty;
        public string OrderBy { get; set; } = "createdOn";
        public string? FilterBy { get; set; } = null;
        public string? FilterValue { get; set; } = null;
        public bool IsDescending { get; set; } = true;
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        [Required(ErrorMessage = "ChatGroupId is required")]
        public Guid ChatGroupId { get; set; } = Guid.Empty;
        public MessageType? Type { get; set; } = null;
    }
}