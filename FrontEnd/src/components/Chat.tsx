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
import { InviteToChat } from "./InviteToChat";
import VideoCall from "./VideoCall";
import { UserProfile } from "@/Models/User";
import { EditChat } from "./EditChat";

export default function Chat({
  selectedChat,
  chatService,
  userService,
  setAllChats,
}: {
  selectedChat?: InviteToChatType | null;
  chatService: ChatService;
  userService: UserService;
  setAllChats: any;
}) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [userList, setUserList] = useState<UserProfile[]>([]);

  useEffect(() => {
    if (!selectedChat) return;

    chatService.getPeopleInChat(selectedChat.chatGroup.id).then((users) => {
      if (!users?.data) return;
      console.log(users.data, "users in chat");

      setUserList(users?.data);
    });

    return () => {
      setMessages([]);

      if (!selectedChat) return;
      chatService.leaveChatRoom(selectedChat.chatGroup.id);
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
                {/* <TabsTrigger
                  className="focus:bg-slate-700 data-[state=active]:bg-slate-300/80 w-16 flex gap-1 "
                  value="call"
                >
                  {false && <IoMdCall />}
                  {true && (
                    <div className="text-green-500 animate-pulse">
                      <IoMdCall />
                    </div>
                  )}
                </TabsTrigger> */}
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
                setAllChats={setAllChats}
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
              {selectedChat.isAdmin && (
                <>
                  <InviteToChat
                    chatGroupId={selectedChat.chatGroup.id}
                    chatService={chatService}
                  ></InviteToChat>
                  <EditChat
                    selectedChat={selectedChat}
                    setAllChats={setAllChats}
                    chatService={chatService}
                  ></EditChat>
                </>
              )}
              {/* user list */}
              <section className="px-4 py-4 flex flex-col gap-2">
                <h3 className="text-2xl font-semibold text-gray-300">Users</h3>
                {userList.map((user) => {
                  return (
                    <div className="flex gap-2 items-center py-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.logo} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-0">
                        <h1 className="text-gray-300 p-0">{user.username}</h1>
                        <h2 className="text-gray-500 text-xs">{user.email}</h2>
                      </div>
                    </div>
                  );
                })}
              </section>
            </TabsContent>
            <TabsContent value="call">
              <VideoCall></VideoCall>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
}
