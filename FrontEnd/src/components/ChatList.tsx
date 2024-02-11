import { FormHTMLAttributes, useEffect, useState } from "react";
import { useAuth } from "../Context/useAuth";
import { api } from "../Services/AuthService";
import { useNavigate } from "react-router";
import { UseFormHandleSubmit } from "react-hook-form";
import { toast } from "react-toastify";
import InvitesList from "./InvitesList";
import { InviteToChatType, UserService } from "../Services/UserService";
import { ChatService } from "../Services/ChatService";

export default function ChatList({
  setSelectedChat,
  selectedChat,
  chatService,
  userService,
  allChats,
}: {
  setSelectedChat: (chat: InviteToChatType) => void;
  selectedChat: InviteToChatType | null;
  chatService: ChatService;
  userService: UserService;
  allChats: InviteToChatType[];
}) {
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  const createChatModule = async (formData: FormData) => {
    const name = formData.get("name")?.toString();
    const logo = formData.get("logo")?.toString();

    if (!name || !logo) return toast.error("Name and logo are required");

    await userService.createChat(name, logo);

    setIsNewChatModalOpen(false);
  };

  return (
    <div className="p-4 col-span-2 h-full bg-zinc-950/30 backdrop-blur-lg  text-white m-2 rounded-md border border-slate-700/80">
      <div className="flex flex-col gap-2 my-2 ">
        <div className="w-full">
          <h1 className="text-2xl font-rubik">Hash</h1>
        </div>
        <section
          id="search-chats"
          className="flex rounded-xl px-2 py-1 bg-slate-900"
        >
          <input
            type="text"
            className="text-sm text-black outline-none bg-transparent"
            placeholder="Search chats"
          />
        </section>
        {allChats?.length == 0 && allChats ? (
          <div>No chats</div>
        ) : (
          allChats?.map((chat: InviteToChatType) => (
            <button
              onClick={() => setSelectedChat(chat)}
              key={chat.id}
              className={`${
                selectedChat?.id == chat.id ? "bg-gray-500" : "bg-gray-700"
              } text-sm py-1 px-2 flex gap-1`}
            >
              <img
                className="h-5 w-5 rounded-full object-cover"
                src={chat.chatGroup.logo}
                alt=""
              />
              <p>{chat.chatGroup.name}</p>
            </button>
          ))
        )}
      </div>
      <button onClick={() => setIsNewChatModalOpen(!isNewChatModalOpen)}>
        New Chat
      </button>
      {isNewChatModalOpen && (
        <form
          method={`${api}/api/group`}
          action="POST"
          className="flex flex-col gap-2 py-1"
          onSubmit={(e) => {
            e.preventDefault();
            createChatModule(new FormData(e.target as HTMLFormElement));
          }}
        >
          <input
            className="p-1 text-sm text-black outline-none"
            type="text"
            placeholder="Chat name"
            name="name"
            required
          />
          <input
            type="text"
            className="p-1 text-sm text-black outline-none"
            placeholder="Image url"
            name="logo"
            required
          />
          <button
            type="submit"
            className="bg-green-500 font-medium hover:bg-green-600"
          >
            Create
          </button>
        </form>
      )}
      <InvitesList chatService={chatService} userService={userService} />
    </div>
  );
}
