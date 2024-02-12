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
  return <div className="row-span-6 "></div>;
}
