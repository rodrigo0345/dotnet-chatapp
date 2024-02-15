import { useEffect, useState } from "react";
import { ChatService, MessageType } from "../Services/ChatService";
import ChatFeed from "./ChatFeed";
import CreateMessage from "./CreateMessage";
import { set } from "react-hook-form";
import Invite from "./Invite";
import * as signalR from "@microsoft/signalr";
import { api } from "../Services/AuthService";
import { InviteToChatType, UserService } from "../Services/UserService";
import { useAuth } from "../Context/useAuth";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoIosAdd, IoIosSave, IoMdCall, IoMdSettings } from "react-icons/io";
import { IoChatboxSharp, IoSend } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { MdEdit } from "react-icons/md";

export default function Chat({
  selectedChat,
  chatService,
  userService,
}: {
  selectedChat: InviteToChatType;
  chatService: ChatService;
  userService: UserService;
}) {
  const [messages, setMessages] = useState<MessageType[]>([]);

  useEffect(() => {
    return () => {
      chatService.leaveChatRoom(selectedChat.chatGroup.id);
      setMessages([]);
    };
  }, [selectedChat]);

  if (selectedChat === null) {
    return (
      <div className="flex h-full w-full justify-center items-center">
        <h1 className="animate-ping">Loading...</h1>
      </div>
    );
  }
  return (
    <>
      {selectedChat && (
        <div className="relative h-full p-0">
          <Tabs
            defaultValue="chat"
            orientation="vertical"
            className="flex flex-col justify-between h-full relative"
          >
            <header className="row-span-1 flex gap-2 self-start pb-4 w-full text-white justify-between px-4 align-middle items-center relative border-0 border-b border-slate-700/80">
              <TabsList className="bg-slate-950/30">
                <TabsTrigger
                  className="focus:bg-slate-700 data-[state=active]:bg-slate-300/80 w-16 flex gap-1"
                  value="chat"
                  defaultChecked
                >
                  <IoChatboxSharp />
                </TabsTrigger>
                <TabsTrigger
                  className="focus:bg-slate-700 data-[state=active]:bg-slate-300/80 w-16 flex gap-1 "
                  value="call"
                >
                  {false && <IoMdCall />}
                  {true && (
                    <div className="text-green-500 animate-pulse">
                      <IoMdCall />
                    </div>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  className="focus:bg-slate-700 data-[state=active]:bg-slate-300/80 w-16 flex gap-1 "
                  value="settings"
                >
                  <IoMdSettings />
                </TabsTrigger>
              </TabsList>

              <section className="flex items-center gap-3">
                <h2 className="text-sm text-gray-300">
                  {selectedChat.chatGroup.name}
                </h2>
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    className="object-cover"
                    src={selectedChat.chatGroup.logo}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </section>

              {/* <Invite
              chatService={chatService}
              userService={userService}
              chatGroup={selectedChat}
            ></Invite> */}
            </header>
            <TabsContent
              value="chat"
              className="relative grow flex flex-col justify-between w-full"
            >
              <ChatFeed
                messages={messages}
                setMessages={setMessages}
                group={selectedChat}
                chatService={chatService}
                userService={userService}
              ></ChatFeed>
              <CreateMessage
                group={selectedChat}
                setMessages={setMessages}
                chatService={chatService}
                userService={userService}
              ></CreateMessage>
            </TabsContent>
            <TabsContent value="settings" className="relative grow h-full">
              <section className="px-4 py-4 flex flex-col gap-2">
                <h3 className="text-2xl font-semibold text-gray-300">
                  Invite User
                </h3>
                <div className="flex items-center relative h-fit">
                  <div className="flex rounded-md items-center px-2 pl-4 py-2 gap-2 bg-slate-900">
                    <input
                      type="text"
                      className="text-sm text-gray-200 outline-none bg-transparent w-60"
                      placeholder="Username or Email"
                    />
                  </div>
                  <button
                    onClick={() => {}}
                    className="bg-blue-950/80 text-sm px-2 py-2  h-full flex items-center justify-center relative rounded-md text-gray-300 hover:brightness-125 transition-all"
                  >
                    <IoSend size={20} />
                  </button>
                </div>
              </section>
              <section className="px-4 py-4 flex flex-col gap-2">
                <h3 className="text-2xl font-semibold text-gray-300">
                  Chat Settings
                </h3>
                <div className="flex gap-4 items-center mt-4">
                  <button
                    type="button"
                    className="group relative h-16 w-16 overflow-hidden"
                  >
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        className="object-cover"
                        src={selectedChat.chatGroup.logo}
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="hidden group-hover:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all bg-gray-800/20 hover:backdrop-blur-sm h-full w-full items-center justify-center rounded-full">
                      <MdEdit />
                    </div>
                  </button>
                  <div className="flex items-center px-2 pl-4 py-2 gap-2 border-b-2 border-gray-300">
                    <input
                      type="text"
                      className="text-gray-200 outline-none bg-transparent w-60 text-xl"
                      placeholder={selectedChat.chatGroup.name}
                    />
                  </div>
                </div>
                <button
                  onClick={() => {}}
                  className="w-fit bg-blue-950/80 text-sm px-2 py-2 mt-4  h-full flex gap-2 items-center justify-center relative rounded-md text-gray-300 hover:brightness-125 transition-all"
                >
                  Save
                  <IoIosSave size={20} />
                </button>
              </section>
            </TabsContent>
            <TabsContent value="call"></TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
}
