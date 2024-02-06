using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using ccnd.Interfaces;
using chatapp.Models;

namespace chatapp.Helpers
{
    public class ChatGroupQueryObject
    {
        public string Query { get; set; } = String.Empty;

        // check all chtgroups that have this person
        public Guid? WithUser { get; set; } = null;
        public bool IsDescending { get; set; } = true;
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}