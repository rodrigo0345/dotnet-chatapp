import { useEffect, useState } from "react";
import Chat from "../components/Chat";
import ChatList from "../components/ChatList";
import { InviteToChatType, UserService } from "../Services/UserService";
import { ChatService } from "../Services/ChatService";
import { useAuth } from "../Context/useAuth";
import { get } from "react-hook-form";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Chats() {
  const { user, getToken, logout } = useAuth();

  const [selectedChat, setSelectedChat] = useState<InviteToChatType | null>(
    null
  );
  const [chatList, setChatList] = useState<InviteToChatType[]>([]);
  const [chatService, setChatService] = useState<ChatService | null>();
  const [userService, setUserService] = useState<UserService | null>();

  useEffect(() => {
    const token = getToken();
    const userId = user?.id;

    if (!token || !userId) {
      logout();
      return;
    }

    const cs = new ChatService(userId, token);
    const us = new UserService(userId, token);

    setChatService(cs);
    setUserService(us);

    // load the last opened chat
    const lchatid = us.getLastOpenChat();

    us.getMyChats().then((chats) => {
      setChatList(chats.data);
      setSelectedChat(() => {
        const found = chats.data?.find((chat) => chat.chatGroup.id === lchatid);
        console.log("found:", found);
        return found ? found : chats.data[0];
      });
    });

    return () => {
      setChatService(null);
      setUserService(null);
    };
  }, []);

  if (!chatService || !userService || !selectedChat)
    return <div>Loading...</div>;

  return (
    <div className="grid grid-flow-row grid-cols-6 h-full relative  p-6 font-customFont bg-gradient-to-tl from-gray-700/60 to-slate-950">
      <ResizablePanelGroup className="col-span-6" direction="horizontal">
        <ResizablePanel defaultSize={45} minSize={30} maxSize={45}>
          <ChatList
            userService={userService}
            chatService={chatService}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            allChats={chatList}
          ></ChatList>
        </ResizablePanel>
        <ResizableHandle className="bg-transparent" />
        <ResizablePanel defaultSize={80}>
          <Chat
            chatService={chatService}
            userService={userService}
            selectedChat={selectedChat}
          ></Chat>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
