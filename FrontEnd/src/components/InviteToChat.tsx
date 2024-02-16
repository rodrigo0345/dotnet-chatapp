import { ChatService } from "@/Services/ChatService";
import { IoSend } from "react-icons/io5";
import { toast } from "react-toastify";

export const InviteToChat = ({
  chatService,
  chatGroupId,
}: {
  chatService: ChatService;
  chatGroupId: string;
}) => {
  const inviteUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const username = form.get("username") as string;
    if (!username) return;

    await chatService.inviteToChat(chatGroupId, username);
  };

  return (
    <form
      onSubmit={(e) => inviteUser(e)}
      className="px-4 py-4 flex flex-col gap-2"
    >
      <h3 className="text-2xl font-semibold text-gray-300">Invite User</h3>
      <div className="flex items-center relative h-fit">
        <div className="flex rounded-md items-center px-2 pl-4 py-2 gap-2 bg-slate-900">
          <input
            autoComplete="off"
            type="text"
            name="username"
            className="text-sm text-gray-200 outline-none bg-transparent w-60"
            placeholder="Username or Email"
          />
        </div>
        <button
          onClick={() => {}}
          type="submit"
          className="bg-blue-950/80 text-sm px-2 py-2  h-full flex items-center justify-center relative rounded-md text-gray-300 hover:brightness-125 transition-all"
        >
          <IoSend size={20} />
        </button>
      </div>
    </form>
  );
};
