using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using chatapp.Models;
using Microsoft.AspNetCore.Identity;

namespace ShoppingProject.Models
{
    public class AppUser : IdentityUser
    {
        public string Bio { get; set; } = String.Empty;
        public string Logo { get; set; } = String.Empty;

        public List<JoinedChat> JoinedChats { get; set; } = new List<JoinedChat>();

        public List<JoinedChat> Chats { get; set; } = new List<JoinedChat>();

    }
}