import { useEffect, useState } from "react";
import { getMyChats } from "../Services/ChatService";
import { useAuth } from "../Context/useAuth";

export default function ChatList() {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  useEffect(() => {
    getMyChats(user?.id ?? "0").then((chats: any) => {
      setChats(chats.data);
    });
  }, []);

  return (
    <div className="col-span-2 h-full bg-zinc-800 text-white">
      <h1>ChatList</h1>
      <button onClick={() => setIsNewChatModalOpen(!isNewChatModalOpen)}>
        New Chat
      </button>
      {isNewChatModalOpen && (
        <div>
          <input type="text" placeholder="Chat name" />
          <button>Create</button>
        </div>
      )}
      <div>
        {chats.length == 0 ? (
          <div>No chats</div>
        ) : (
          chats.map((chat: any) => <div key={chat.id}>{chat.name}</div>)
        )}
      </div>
    </div>
  );
}
