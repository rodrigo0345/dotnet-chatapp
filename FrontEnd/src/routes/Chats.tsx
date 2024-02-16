import { useEffect, useMemo, useState } from "react";
import Chat from "../components/Chat";
import ChatList from "../components/ChatList";
import { InviteToChatType, UserService } from "../Services/UserService";
import { ChatService } from "../Services/ChatService";
import { useAuth } from "../Context/useAuth";
import { get, set } from "react-hook-form";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import * as signalR from "@microsoft/signalr";

export default function Chats() {
  const { user, getToken, logout } = useAuth();

  const [selectedChat, setSelectedChat] = useState<InviteToChatType | null>(
    null
  );
  const [chatList, setChatList] = useState<InviteToChatType[]>([]);
  const connection: signalR.HubConnection = useMemo(
    () =>
      new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5100/api/chatHub", {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        })
        .build(),
    []
  );
  const cs = useMemo(
    () => new ChatService(user?.id ?? "0", getToken(), connection),
    []
  );
  const us = useMemo(
    () => new UserService(user?.id ?? "0", getToken(), connection),
    []
  );

  useEffect(() => {
    const serverUrl = "http://localhost:5100/api";

    if (!getToken() || !user?.id) {
      logout();
      return;
    }

    // load the last opened chat
    const lchatid = us.getLastOpenChat();

    us.getMyChats().then((chats) => {
      chats.data.forEach((chat) => {
        cs.listenForChatChanges(chat.chatGroup.id, setChatList, selectedChat);
      });
      setChatList(chats.data);
      setSelectedChat(() => {
        const found = chats.data?.find((chat) => chat.chatGroup.id === lchatid);
        return found ? found : chats.data[0];
      });
    });
  }, []);

  useEffect(() => {
    console.log("chatList", chatList);
  }, [chatList]);

  return (
    <div className="grid grid-flow-row grid-cols-6 h-full relative  p-6 font-customFont bg-gradient-to-tl from-gray-700/60 to-slate-950">
      <ResizablePanelGroup className="col-span-6" direction="horizontal">
        <ResizablePanel defaultSize={45} minSize={30} maxSize={45}>
          <ChatList
            userService={us}
            chatService={cs}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            allChats={chatList}
          ></ChatList>
        </ResizablePanel>
        <ResizableHandle className="bg-transparent" />
        <ResizablePanel defaultSize={80}>
          <Chat
            setAllChats={setChatList}
            chatService={cs}
            userService={us}
            selectedChat={selectedChat}
          ></Chat>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
