import { FormHTMLAttributes, useEffect, useState } from "react";
import { ChatGroupProp, createChat, getMyChats } from "../Services/ChatService";
import { useAuth } from "../Context/useAuth";
import { ChatProp } from "../Services/ChatService";
import { api } from "../Services/AuthService";
import { useNavigate } from "react-router";
import { UseFormHandleSubmit } from "react-hook-form";
import { toast } from "react-toastify";
import InvitesList from "./InvitesList";

export default function ChatList({
  setMainChat,
  mainChat,
}: {
  setMainChat: (chat: ChatGroupProp) => void;
  mainChat: ChatGroupProp | null;
}) {
  const { user, getToken } = useAuth();
  const [chats, setChats] = useState<ChatGroupProp[]>([]);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  useEffect(() => {
    getMyChats(user?.id ?? "0", getToken()).then((chats: any) => {
      console.log({ chats });
      setChats(chats.data);
      setMainChat(chats.data[0]);
    });
  }, []);

  const createChatModule = async (formData: FormData) => {
    const name = formData.get("name")?.toString();
    const logo = formData.get("logo")?.toString();

    if (!name || !logo) return toast.error("Name and logo are required");

    const token = getToken();

    if (!token) return toast.error("You are not logged in");
    console.warn({ token });

    const data = await createChat(name, logo, token);

    setIsNewChatModalOpen(false);
    setChats((prev) => [...prev, data.data]);
  };

  return (
    <div className="p-1 col-span-2 h-full bg-zinc-800 text-white">
      <div className="flex flex-col gap-2 my-2">
        {chats?.length == 0 && chats ? (
          <div>No chats</div>
        ) : (
          chats?.map((chat: ChatGroupProp) => (
            <button
              onClick={() => setMainChat(chat)}
              key={chat.id}
              className={`${
                mainChat?.id == chat.id ? "bg-gray-500" : "bg-gray-700"
              } text-sm py-1 px-2 flex gap-1`}
            >
              <img
                className="h-5 w-5 rounded-full object-cover"
                src={chat.chatGroup.logo}
                alt=""
              />
              <p>{chat.chatGroup.name}</p>
            </button>
          ))
        )}
      </div>
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
      <InvitesList />
    </div>
  );
}
