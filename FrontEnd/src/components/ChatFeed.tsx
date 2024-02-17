import { useEffect, useRef, useState } from "react";
import { ChatService, MessageType } from "../Services/ChatService";
import { useAuth } from "../Context/useAuth";
import Message from "./Message";
import { InviteToChatType, UserService } from "../Services/UserService";
import { ScrollArea } from "@/components/ui/scroll-area";
import ScrollContainer from "./ScrollContainer";
import InfiniteScroll from "react-infinite-scroll-component";
import { set } from "react-hook-form";
import { toast } from "react-toastify";

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
  const [loading, setLoading] = useState(true);
  const [height, setHeight] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [lastScrollHeight, setLastScrollHeight] = useState(0);
  const [newMessageButton, setNewMessageButton] = useState(false);

  const ref = useRef<any>(null);

  useEffect(() => {
    setHeight(ref?.current?.scrollHeight);
  }, [ref]);

  useEffect(() => {
    if (messages.length === 0) setLoading(true);

    const fetchData = async () => {
      try {
        const result = await chatService.getChatMessages(group.chatGroup.id);
        if (result && result.data) {
          setMessages(result.data.reverse());
          userService.saveLastOpenChat(group.chatGroup.id);
        }
        setPageNumber(1);
      } catch (error) {
        console.error("Error fetching initial messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // realtime updates
    chatService.joinChatRoom(group.chatGroup.id, setMessages, setAllChats);

    // cleanup
    return () => {
      chatService.leaveChatRoom(group.chatGroup.id);
    };
  }, [group, setMessages, userService, chatService, setAllChats]);

  const scrollToBottom = () => {
    if (!ref.current) return;
    if (ref.current.scrollHeight > 300) {
      setNewMessageButton(true);
      return;
    }
    ref.current.scrollTop = ref.current.scrollHeight;
  };

  function handleScroll() {
    const container = document.getElementById("scrollableDiv");
    if (!container) return;

    console.log({
      scrollHeight: container.scrollHeight,
      scrollTop: container.scrollTop,
      offsetHeight: container.offsetHeight,
    });
    if (container.scrollTop != 0) return;

    loadNextPage();
  }

  const loadNextPage = () => {
    setLastScrollHeight(ref.current.scrollHeight);

    chatService
      .getChatMessages(group.chatGroup.id, pageNumber + 1)
      .then(async (result) => {
        await setTimeout(() => {}, 1000);
        if (result && result.data) {
          // Reverse the new messages and update the state
          setMessages((prev: MessageType[]) => {
            const aux = [...result.data, ...prev];

            return aux.sort((a, b) => {
              return (
                new Date(a.createdOn).getTime() -
                new Date(b.createdOn).getTime()
              );
            });
          });

          // Update the page number
          setPageNumber((prev) => prev + 1);
        }
      });
  };

  useEffect(() => {
    if (!ref.current) return;
    ref.current.scrollTop =
      ref.current.scrollHeight -
      lastScrollHeight -
      ref.current.offsetHeight +
      200;

    scrollToBottom();
  }, [messages]);

  return (
    <div
      id="scrollableDiv"
      ref={ref}
      className={`h-[630px] row-span-7 rounded-md text-gray-300 grow py-4 px-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900 relative w-full overflow-y-auto`}
      onScroll={handleScroll}
    >
      {messages.map((message, index) => (
        <Message
          key={index}
          lastMessage={messages[index - 1] ?? null}
          message={message}
        />
      ))}
    </div>
  );
}
