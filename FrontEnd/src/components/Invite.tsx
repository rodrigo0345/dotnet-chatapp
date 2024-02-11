import { FormEvent } from "react";
import { useAuth } from "../Context/useAuth";
import { InviteToChatType, UserService } from "../Services/UserService";
import { ChatService } from "../Services/ChatService";

export default function Invite({
  chatGroup,
  userService,
  chatService,
}: {
  chatGroup: InviteToChatType | null;
  userService: UserService;
  chatService: ChatService;
}) {
  const { user } = useAuth();

  const inviteFriend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const friend = formData.get("friend");
    const chatGroupId = chatGroup?.chatGroup.id;

    if (friend?.toString().trim().length === 0 || !friend || !chatGroupId)
      return;

    // send invite
    await chatService.inviteToChat(chatGroupId, friend.toString());
  };

  if (chatGroup?.chatGroup.userId != user?.id) {
    return <div></div>;
  }
  return (
    <div className="flex flex-col items-center justify-center h-full relative">
      <form
        className="flex items-center justify-center relative h-full"
        onSubmit={inviteFriend}
      >
        <input
          type="text"
          className="p-1 border border-gray-300 rounded-l-md outline-none px-2 text-black"
          placeholder="Friend's username"
          name="friend"
        ></input>
        <button className=" h-full p-1 bg-blue-500 text-white rounded-r-md">
          Invite
        </button>
      </form>
    </div>
  );
}
