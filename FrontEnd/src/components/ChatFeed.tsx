import { useEffect, useState } from "react";
import { ChatService, MessageType } from "../Services/ChatService";
import { useAuth } from "../Context/useAuth";
import Message from "./Message";
import { InviteToChatType, UserService } from "../Services/UserService";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <div className="row-span-6 ">
      <ScrollArea className="h-full w-full rounded-md text-gray-300 p-4">
        Jokester began sneaking into the castle in the middle of the night and
        leaving jokes all over the place: under the king's pillow, in his soup,
        even in the royal toilet. The king was furious, but he couldn't seem to
        stop Jokester. And then, one day, the people of the kingdom discovered
        that the jokes left by Jokester were so funny that they couldn't help
        but laugh. And once they started laughing, they couldn't stop.
      </ScrollArea>
    </div>
  );
}
