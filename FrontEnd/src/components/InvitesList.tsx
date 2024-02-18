import { useEffect, useState } from "react";
import { InviteToChatType, UserService } from "../Services/UserService";
import { ChatService } from "../Services/ChatService";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FaCheck } from "react-icons/fa";

export default function InvitesList({
  userService,
  chatService,
  setChatList,
}: {
  userService: UserService;
  chatService: ChatService;
  setChatList: any;
}) {
  const [invites, setInvites] = useState<InviteToChatType[]>([]);

  const getInvites = async () => {
    return await userService.getPendentInvites();
  };

  const acceptInviteModule = async (chat: InviteToChatType) => {
    const result = await userService.acceptInvite(chat);

    if (!result) return console.error("Error accepting invite");

    setInvites((prev) => prev.filter((invite) => invite.id !== chat.id));
    setChatList((prev: InviteToChatType[]) => [chat, ...prev]);
  };

  useEffect(() => {
    getInvites().then((invites) => {
      setInvites(invites.data);
    });
    userService.listenForPersonalEvents(userService._userId, setInvites);
  }, []);

  return (
    <section className="flex flex-col px-4 justify-between py-2">
      {invites.length > 0 && (
        <div className="text-sm font-light text-gray-200">Invites</div>
      )}
      {invites &&
        invites.map((chat) => {
          return (
            <div
              key={chat.id}
              className={`flex w-full items-center justify-normal gap-1 px-0 py-2`}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage
                    className="object-cover"
                    src={chat.chatGroup.logo}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div
                key={chat.id}
                className="w-full text-start text-base py-1 px-2 flex rounded-md items-center overflow-hidden justify-between "
              >
                <h3 className="text-sm">{chat.chatGroup.name}</h3>
                <button
                  className="h-6 w-6 rounded-full flex items-center justify-center bg-green-700 hover:bg-green-800"
                  onClick={() => acceptInviteModule(chat)}
                >
                  <FaCheck className="text-white text-sm" size={10} />
                </button>
              </div>
            </div>
          );
        })}
    </section>
  );
}
