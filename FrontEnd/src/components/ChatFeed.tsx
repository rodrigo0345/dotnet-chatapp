import { useEffect, useState } from "react";
import {
  ChatGroupProp,
  MessageResponse,
  getChatMessages,
  getMyChats,
  joinChatRoom,
} from "../Services/ChatService";
import { useAuth } from "../Context/useAuth";
import Message from "./Message";

export default function ChatFeed({
  group,
  messages,
  setMessages,
  connection,
}: {
  group: ChatGroupProp;
  messages: MessageResponse[];
  setMessages: any;
  connection: signalR.HubConnection;
}) {
  const { getToken, user } = useAuth();

  useEffect(() => {
    console.log({ groupId: group.chatGroup.id, token: getToken() });
    getChatMessages(group.chatGroup.id, getToken()).then((messages) => {
      if (messages) setMessages(messages.data);
    });
    joinChatRoom(
      group.chatGroup.id,
      user?.id ?? "0",
      getToken(),
      setMessages,
      connection
    );
  }, [group]);

  const scrollToBottom = () => {
    const chatFeed = document.getElementById("chat-feed");
    if (chatFeed) {
      chatFeed.scrollTop = chatFeed.scrollHeight;
    }
  };
  return (
    <div className="grid grid-flow-row grid-cols-6 h-full">
      <div className="col-span-6">
        <div
          onLoad={scrollToBottom}
          id="chat-feed"
          className="overflow-y-scroll p-4 max-h-[73.5vh] min-h-[73.5vh] bg-gray-100 scroll-smooth"
        >
          {messages.map((message) => (
            <Message key={message.id} {...message} />
          ))}
        </div>
      </div>
      <button
        className="absolute bottom-24 left-4 bg-blue-400/70 h-10 w-10 rounded-full"
        onClick={scrollToBottom}
      ></button>
    </div>
  );
}
