import { useEffect, useRef, useState } from "react";
import { ChatService, MessageType } from "../Services/ChatService";
import { useAuth } from "../Context/useAuth";
import Message from "./Message";
import { InviteToChatType, UserService } from "../Services/UserService";
import { ScrollArea } from "@/components/ui/scroll-area";
import ScrollContainer from "./ScrollContainer";

export default function ChatFeed({
  group,
  messages,
  setMessages,
  chatService,
  userService,
  setAllChats,
}: {
  group: InviteToChatType;
  messages: MessageType[];
  setMessages: any;
  chatService: ChatService;
  userService: UserService;
  setAllChats: any;
}) {
  const [height, setHeight] = useState(0);
  const [loading, setLoading] = useState(true);
  const ref = useRef<any>(null);

  useEffect(() => {
    setHeight(ref?.current?.innerHeight);
  });

  useEffect(() => {
    if (messages.length === 0) setLoading(true);
    chatService.getChatMessages(group.chatGroup.id).then((messages) => {
      if (messages) setMessages(messages.data.reverse());
      userService.saveLastOpenChat(group.chatGroup.id);
      setLoading(false);
    });

    // realtime updates
    chatService.joinChatRoom(group.chatGroup.id, setMessages, setAllChats);

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
    // <ScrollArea
    //   className={`h-[630px] row-span-7 w-full rounded-md text-gray-300 mt-4 px-4`}
    // >
    <ScrollContainer
      className={`h-[630px] row-span-7 rounded-md text-gray-300 grow py-4 px-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900 relative w-full`}
    >
      {loading && (
        <img
          src="/loading.gif"
          alt="loading cat"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-50 bg-slate-950/80 backdrop-blur-lg"
        />
      )}
      {messages.map((message, index) => (
        <Message
          key={index}
          lastMessage={messages[index - 1] ?? null}
          message={message}
        />
      ))}
    </ScrollContainer>
    // </ScrollArea>
  );
}
