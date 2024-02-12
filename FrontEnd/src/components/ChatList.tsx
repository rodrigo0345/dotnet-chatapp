import { FormHTMLAttributes, useEffect, useState } from "react";
import { useAuth } from "../Context/useAuth";
import { api } from "../Services/AuthService";
import { useNavigate } from "react-router";
import { UseFormHandleSubmit, set } from "react-hook-form";
import { toast } from "react-toastify";
import InvitesList from "./InvitesList";
import { InviteToChatType, UserService } from "../Services/UserService";
import { CiSearch } from "react-icons/ci";
import { ChatService } from "../Services/ChatService";
import { IoIosAdd } from "react-icons/io";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    <div className=" col-span-2 row-span-6 h-full bg-zinc-950/30 backdrop-blur-lg  text-white mx-2 rounded-md border border-slate-700/80 shadow-lg">
      <div className="flex flex-col gap-2 my-2">
        <div className="w-full px-4 pt-2">
          <h1 className="text-2xl font-rubik text-gray-200 font-light">Hash</h1>
        </div>
        <form
          id="search-chats"
          className="flex mx-4 rounded-full items-center px-2 pl-4 py-2 gap-2 bg-slate-900"
        >
          <CiSearch size={15} />
          <input
            type="text"
            className="text-sm text-gray-200 outline-none bg-transparent"
            placeholder="Search chats"
          />
        </form>
        <section className="flex px-4 justify-between py-2">
          <div className="text-sm font-light text-gray-200">New</div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <button
                  onClick={() => {
                    setIsNewChatModalOpen(!isNewChatModalOpen);
                  }}
                  className="bg-blue-950/80 flex items-center justify-center relative w-6 h-6 rounded-full text-gray-300"
                >
                  <IoIosAdd size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create new group</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Dialog
            open={isNewChatModalOpen}
            onOpenChange={setIsNewChatModalOpen}
          >
            <DialogContent>
              <p>Dialog content</p>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
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
            </DialogContent>
          </Dialog>
        </section>
        {allChats?.length == 0 && allChats ? (
          <div>No chats</div>
        ) : (
          allChats?.map((chat: InviteToChatType) => (
            <div
              className={`flex items-center justify-normal gap-1 px-4 py-2 ${
                selectedChat?.id == chat.id
                  ? " bg-slate-800/70 "
                  : " bg-transparent"
              } `}
            >
              <div className="relative">
                <div className="bottom-0 right-0 bg-green-400 h-2 w-2 rounded-full absolute"></div>
                <Avatar>
                  <AvatarImage
                    className="object-cover"
                    src={chat.chatGroup.logo}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <button
                onClick={() => setSelectedChat(chat)}
                key={chat.id}
                className="text-base py-1 px-2 flex flex-col rounded-md overflow-hidden "
              >
                <h3 className="text-sm">{chat.chatGroup.name}</h3>
                <p className="text-nowrap w-full text-xs text-gray-400 text-ellipsis overflow-hidden">
                  Last message, cool, I guess it is really long
                </p>
              </button>
            </div>
          ))
        )}
      </div>
      <InvitesList chatService={chatService} userService={userService} />
    </div>
  );
}
