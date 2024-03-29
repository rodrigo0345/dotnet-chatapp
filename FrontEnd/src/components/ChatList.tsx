import { FormHTMLAttributes, useEffect, useState } from "react";
import { useAuth } from "../Context/useAuth";
import { api } from "../Services/AuthService";
import { useNavigate } from "react-router";
import { UseFormHandleSubmit, set } from "react-hook-form";
import { toast } from "react-toastify";
import InvitesList from "./InvitesList";
import { InviteToChatType, UserService } from "../Services/UserService";
import { CiImageOn, CiSearch } from "react-icons/ci";
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
import { IoSend } from "react-icons/io5";
import { v4 as uuidv4 } from "uuid";
import { ProfileOptions } from "./ProfileOptions";
import { FaCrown } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ChatList({
  setSelectedChat,
  selectedChat,
  chatService,
  userService,
  allChats,
  setAllChats,
}: {
  setSelectedChat: (chat: InviteToChatType) => void;
  selectedChat: InviteToChatType | null;
  chatService: ChatService;
  userService: UserService;
  allChats: InviteToChatType[];
  setAllChats: any;
}) {
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [visibleChats, setVisibleChats] =
    useState<InviteToChatType[]>(allChats);

  useEffect(() => {
    setVisibleChats(allChats);
  }, [allChats]);

  const createChatModule = async (formData: FormData) => {
    const name = formData.get("name")?.toString();
    const formDataLogo = formData.get("logo") as File;

    // create a id with uuid
    const id = uuidv4();
    const logoUrl = await chatService.uploadAttachment(formDataLogo, id);

    if (!name || !logoUrl) return toast.error("Name and logo are required");

    const result = await userService.createChat(name, logoUrl);

    if (result.status != 200) {
      return toast.error("Error creating chat");
    }

    if (result) {
      console.log({ result });
      setAllChats((prev: InviteToChatType[]) => [
        {
          chatGroup: {
            id: result.data.id,
            name,
            logo: logoUrl,
          },
          id: result.data.id,
          lastMessage: result.data.lastMessage,
          seenLastMessage: result.data.seenLastMessage,
        },
        ...prev,
      ]);
    }

    setIsNewChatModalOpen(false);
  };

  const filterChats = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const chats = allChats.filter((chat) =>
      chat.chatGroup.name.toLowerCase().includes(value)
    );
    setVisibleChats(chats);
  };

  return (
    <div className="flex flex-col col-span-2 row-span-6 h-full bg-zinc-950/30 backdrop-blur-lg  text-white mx-2 rounded-md border border-slate-700/80 shadow-lg justify-between">
      <div className="flex flex-col gap-2 my-6 w-full">
        <form
          id="search-chats"
          className="flex mx-4 rounded-full items-center px-2 pl-4 py-2 gap-2 bg-slate-900"
        >
          <CiSearch size={15} />
          <input
            onChange={filterChats}
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
              <DialogHeader>
                <DialogTitle>New Chat</DialogTitle>
                <DialogDescription>
                  Add a new chat group and invite all of your friends to join.
                </DialogDescription>
              </DialogHeader>
              <DialogDescription>
                {isNewChatModalOpen && (
                  <form
                    method={`${api}/api/group`}
                    action="POST"
                    className="flex flex-col gap-2 py-1"
                    onSubmit={(e) => {
                      e.preventDefault();
                      createChatModule(
                        new FormData(e.target as HTMLFormElement)
                      );
                    }}
                  >
                    <div className="flex items-center">
                      <input
                        className="p-1 text-base text-black outline-none"
                        type="text"
                        placeholder="Chat name"
                        name="name"
                        required
                      />
                      <input
                        id="logo"
                        type="file"
                        className="hidden p-1 text-sm text-black outline-none"
                        placeholder="Image url"
                        accept="image/*"
                        name="logo"
                        required
                      />
                      <label htmlFor="logo" className="cursor-pointer">
                        <div className="bg-slate-900 text-sm px-2 py-2  h-full flex items-center justify-center relative rounded-md text-gray-300 hover:brightness-125 transition-all">
                          <CiImageOn size={18} />
                        </div>
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="bg-slate-900 shadow-md mt-4 w-fit px-2 py-1 rounded-md text-white font-medium hover:brightness-150 transition-all text-gray-300"
                    >
                      Create
                    </button>
                  </form>
                )}
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </section>
        {visibleChats?.length == 0 && visibleChats ? (
          <div className="px-4 text-sm text-gray-300">No chats.</div>
        ) : (
          visibleChats?.map((chat: InviteToChatType) => (
            <div
              key={chat?.id ?? "0"}
              className={`flex w-full items-center justify-normal gap-1 px-4 py-2 ${
                selectedChat?.id == chat.id
                  ? " bg-slate-800/70 "
                  : " bg-transparent"
              } `}
            >
              <div className="relative">
                {!chat?.seenLastMessage &&
                  !(selectedChat?.chatGroup.id == chat?.chatGroup.id) && (
                    <div className="top-0 z-10 animate-bounce right-0 bg-green-400 h-2 w-2 rounded-full absolute"></div>
                  )}
                {selectedChat?.isAdmin && (
                  <div className="-top-1 text-yellow-500 bg-gray-700/30 z-10 -left-2 p-0.5 rounded-full absolute">
                    <FaCrown size={13} />
                  </div>
                )}
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
                className="w-full text-start text-base py-1 px-2 flex flex-col rounded-md overflow-hidden "
              >
                <h3 className="text-sm">{chat.chatGroup.name}</h3>
                <p
                  className={`text-nowrap w-full text-xs text-gray-400 text-ellipsis overflow-hidden ${
                    !chat?.seenLastMessage &&
                    !(selectedChat?.chatGroup.id == chat?.chatGroup.id) &&
                    "font-semibold"
                  }`}
                >
                  {chat.lastMessage?.content || "No messages"}
                </p>
              </button>
            </div>
          ))
        )}
      </div>
      <InvitesList
        setChatList={setAllChats}
        chatService={chatService}
        userService={userService}
      />
      <div>
        <div className="w-full flex justify-start pl-4">
          <Link
            to="/termsOfUse"
            className="text-blue-400 hover:text-blue-500 underline text-xs text-center"
          >
            Terms of Use
          </Link>
        </div>
        <ProfileOptions
          chatService={chatService}
          className="self-end"
        ></ProfileOptions>
      </div>
    </div>
  );
}
