import { useState } from "react";
import { ChatGroupProp } from "../Services/ChatService";
import Chat from "../components/Chat";
import ChatList from "../components/ChatList";

export default function Chats() {
  const [selectedChat, setSelectedChat] = useState<ChatGroupProp | null>(null);
  return (
    <div className="grid grid-flow-row grid-cols-6 h-full">
      <ChatList
        mainChat={selectedChat}
        setMainChat={setSelectedChat}
      ></ChatList>
      <Chat mainChat={selectedChat}></Chat>
    </div>
  );
}
