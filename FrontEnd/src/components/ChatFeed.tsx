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
}: {
  group: InviteToChatType;
  messages: MessageType[];
  setMessages: any;
  chatService: ChatService;
  userService: UserService;
}) {
  const [height, setHeight] = useState(0);
  const ref = useRef<any>(null);

  useEffect(() => {
    setHeight(ref?.current?.innerHeight);
  });

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
    // <ScrollArea
    //   className={`h-[630px] row-span-7 w-full rounded-md text-gray-300 mt-4 px-4`}
    // >
    <ScrollContainer
      className={`h-[630px] row-span-7 w-full rounded-md text-gray-300 mt-4 px-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900`}
    >
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
