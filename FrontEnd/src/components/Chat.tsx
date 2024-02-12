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
        <div className="grid col-span-4 row-span-6 relative h-full p-0">
          <section className="row-span-1 flex gap-2 w-full text-white p-4 justify-between px-6 align-middle items-center relative">
            <div className="flex items-center gap-2">
              <img
                src={selectedChat.chatGroup.logo}
                alt="group photo"
                className="w-10 h-10 rounded-full object-cover object-center"
              />
              <h1 className="font-normal text-lg">
                {selectedChat.chatGroup.name}
              </h1>
            </div>
            <Invite
              chatService={chatService}
              userService={userService}
              chatGroup={selectedChat}
            ></Invite>
          </section>
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
        </div>
      )}
    </>
  );
}
