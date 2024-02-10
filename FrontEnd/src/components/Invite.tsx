import { FormEvent } from "react";
import { ChatGroupProp, inviteToChat } from "../Services/ChatService";
import { useAuth } from "../Context/useAuth";

export default function Invite({
  chatGroup,
}: {
  chatGroup: ChatGroupProp | null;
}) {
  const { getToken } = useAuth();
  const inviteFriend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const friend = formData.get("friend");
    const chatGroupId = chatGroup?.chatGroup.id;

    if (!friend || !chatGroupId) return;

    // send invite
    await inviteToChat(chatGroupId, friend.toString(), getToken());
  };
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
