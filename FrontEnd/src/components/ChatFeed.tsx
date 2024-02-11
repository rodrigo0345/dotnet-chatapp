import { useEffect, useState } from "react";
import { ChatService, MessageType } from "../Services/ChatService";
import { useAuth } from "../Context/useAuth";
import Message from "./Message";
import { InviteToChatType, UserService } from "../Services/UserService";

export default function ChatFeed({
  group,
  messages,
  setMessages,
  chatService,
  userService,
}: {
  group: InviteToChatType;
  messages: MessageType[];
  setMessages: any;
  chatService: ChatService;
  userService: UserService;
}) {
  useEffect(() => {
    chatService.getChatMessages(group.chatGroup.id).then((messages) => {
      if (messages) setMessages(messages.data.reverse());
      userService.saveLastOpenChat(group.chatGroup.id);
    });

    // realtime updates
    chatService.joinChatRoom(group.chatGroup.id, setMessages);

    // cleanup
    return () => {
      chatService.leaveChatRoom(group.chatGroup.id);
    };
  }, [group]);

  const scrollToBottom = () => {
    const chatFeed = document.getElementById("chat-feed");
    if (chatFeed) {
      chatFeed.scrollTop = chatFeed.scrollHeight;
    }
  };
  return (
    <div className="grid grid-flow-row grid-cols-6 h-full relative">
      <div className="col-span-6">
        <div
          onLoad={scrollToBottom}
          id="chat-feed"
          className="overflow-y-scroll p-4 max-h-[100%] scroll-smooth"
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
