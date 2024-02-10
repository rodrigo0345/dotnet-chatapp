import { useAuth } from "../Context/useAuth";
import { MessageResponse } from "../Services/ChatService";

export default function Message(message: MessageResponse) {
  const { user } = useAuth();

  function formatMessageDate(createdOn: string) {
    const messageDate = new Date(createdOn);
    const now = new Date();

    const minutesAgo = Math.floor(
      (now.getTime() - messageDate.getTime()) / (1000 * 60)
    );

    if (minutesAgo < 1) {
      return "Just now";
    } else if (minutesAgo < 60) {
      return `${minutesAgo}m ago`;
    } else if (
      now.getFullYear() === messageDate.getFullYear() &&
      now.getMonth() === messageDate.getMonth() &&
      now.getDate() === messageDate.getDate()
    ) {
      return messageDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    } else {
      return messageDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  }

  if (user?.id === message.senderId) {
    if (message.content.trim().length === 0) return null;
    return (
      <div className="w-full min-h-20 flex justify-end relative my-4">
        <div className="self-end max-w-60 flex flex-col justify-end">
          <div className="bg-blue-500 text-white p-2 rounded-lg rounded-tr-[0] shadow-md py-2 px-3 flex flex-col gap-2">
            {message.attachment && (
              <img src={message.attachment} alt="" className="rounded-lg" />
            )}
            {message.content}
          </div>
          <p className="text-xs self-end font-normal">
            {formatMessageDate(message.createdOn)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-20 flex justify-start relative my-4">
      <div className="self-end max-w-60 flex flex-col justify-end">
        <div className="bg-gray-500 text-white p-2 rounded-lg rounded-tl-[0] shadow-md py-2 px-3 flex flex-col gap-2">
          {message.attachment && (
            <img src={message.attachment} alt="" className="rounded-lg" />
          )}
          {message.content}
        </div>
        <p className="text-xs self-end font-normal">
          {formatMessageDate(message.createdOn)}
        </p>
      </div>
    </div>
  );
}
