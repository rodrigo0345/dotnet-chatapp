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
import { group } from "console";
import { IoMdCall } from "react-icons/io";
import { IoChatboxSharp } from "react-icons/io5";

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
            className="grid col-span-4 row-span-8 h-full relative"
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
                  className="focus:bg-slate-700 data-[state=active]:bg-slate-300/80 w-16 flex gap-1"
                  value="call"
                >
                  {false && <IoMdCall />}
                  {true && (
                    <div className="text-green-500 animate-pulse">
                      <IoMdCall />
                    </div>
                  )}
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
            <TabsContent value="chat" className="row-span-10 grid">
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
            <TabsContent value="" className="row-span-5"></TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
}
