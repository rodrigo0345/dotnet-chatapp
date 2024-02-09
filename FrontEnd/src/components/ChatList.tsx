import { FormHTMLAttributes, useEffect, useState } from "react";
import { createChat, getMyChats } from "../Services/ChatService";
import { useAuth } from "../Context/useAuth";
import { ChatProp } from "../Services/ChatService";
import { api } from "../Services/AuthService";
import { useNavigate } from "react-router";
import { UseFormHandleSubmit } from "react-hook-form";
import { toast } from "react-toastify";

export default function ChatList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState<ChatProp[]>([]);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  useEffect(() => {
    getMyChats(user?.id ?? "0").then((chats: any) => {
      setChats(chats.data);
    });
  }, []);

  const createChatModule = async (formData: FormData) => {
    const name = formData.get("name")?.toString();
    const logo = formData.get("logo")?.toString();
    if (!name || !logo) return toast.error("Name and logo are required");

    const data = await createChat(name, logo);
    console.log({ data });
    setIsNewChatModalOpen(false);
  };

  return (
    <div className="p-1 col-span-2 h-full bg-zinc-800 text-white">
      <button onClick={() => setIsNewChatModalOpen(!isNewChatModalOpen)}>
        New Chat
      </button>
      {isNewChatModalOpen && (
        <form
          method={`${api}/api/group`}
          action="POST"
          className="flex flex-col gap-2 py-1"
          onSubmit={(e) => {
            e.preventDefault();
            createChatModule(new FormData(e.target as HTMLFormElement));
          }}
        >
          <input
            className="p-1 text-sm text-black outline-none"
            type="text"
            placeholder="Chat name"
            name="name"
            required
          />
          <input
            type="text"
            className="p-1 text-sm text-black outline-none"
            placeholder="Image url"
            name="logo"
            required
          />
          <button
            type="submit"
            className="bg-green-500 font-medium hover:bg-green-600"
          >
            Create
          </button>
        </form>
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
