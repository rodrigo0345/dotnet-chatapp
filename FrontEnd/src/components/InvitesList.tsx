import { useEffect, useState } from "react";
import { useAuth } from "../Context/useAuth";
import {
  ChatGroupProp,
  acceptInvite,
  getPendentInvites,
} from "../Services/ChatService";

export default function InvitesList() {
  const { user, getToken } = useAuth();
  const [invites, setInvites] = useState<ChatGroupProp[]>([]);

  const getInvites = async () => {
    if (!user?.id) return console.error("User not found");
    return await getPendentInvites(user?.id, getToken());
  };

  const acceptInviteModule = async (chat: ChatGroupProp) => {
    const result = await acceptInvite(chat, getToken());

    if (!result) return console.error("Error accepting invite");

    setInvites((prev) => prev.filter((invite) => invite.id !== chat.id));
  };

  useEffect(() => {
    getInvites().then((invites) => {
      setInvites(invites.data);
    });
  }, []);

  return (
    <section>
      {invites &&
        invites.map((invite) => {
          return (
            <div key={invite.id} className="flex justify-between items-center">
              <div>{invite.chatGroup.name}</div>
              <div>
                <button onClick={() => acceptInviteModule(invite)}>
                  Accept
                </button>
              </div>
            </div>
          );
        })}
    </section>
  );
}
