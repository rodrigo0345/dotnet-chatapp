import { useEffect, useState } from "react";
import { InviteToChatType, UserService } from "../Services/UserService";
import { ChatService } from "../Services/ChatService";

export default function InvitesList({
  userService,
  chatService,
}: {
  userService: UserService;
  chatService: ChatService;
}) {
  const [invites, setInvites] = useState<InviteToChatType[]>([]);

  const getInvites = async () => {
    return await userService.getPendentInvites();
  };

  const acceptInviteModule = async (chat: InviteToChatType) => {
    const result = await userService.acceptInvite(chat);

    if (!result) return console.error("Error accepting invite");

    setInvites((prev) => prev.filter((invite) => invite.id !== chat.id));
  };

  useEffect(() => {
    getInvites().then((invites) => {
      setInvites(invites.data);
    });
    userService.listenForPersonalEvents(userService._userId, setInvites);
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
