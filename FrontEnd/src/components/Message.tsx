import { useEffect, useState } from "react";
import { useAuth } from "../Context/useAuth";
import { MessageType } from "../Services/ChatService";
import { set } from "react-hook-form";
import { Separator } from "@/components/ui/separator";

export default function Message({
  message,
  lastMessage,
}: {
  message: MessageType;
  lastMessage: MessageType | null;
}) {
  const { user } = useAuth();
  const [groupMessages, setGroupMessages] = useState<boolean>(false);
  const [isAnotherDay, setIsAnotherDay] = useState<boolean>(false);

  useEffect(() => {
    const currentMessageCreatedOn = new Date(message.createdOn);
    const lastMessageCreatedOn = new Date(lastMessage?.createdOn as any);

    if (currentMessageCreatedOn.getDay() !== lastMessageCreatedOn.getDay()) {
      setIsAnotherDay(true);
      setGroupMessages(false);
      return;
    }

    if (message.senderId !== lastMessage?.senderId) {
      setGroupMessages(false);
      return;
    }

    const timeDifference =
      (currentMessageCreatedOn.getMilliseconds() -
        lastMessageCreatedOn.getMilliseconds()) /
      1000; // converting to seconds

    if (timeDifference > 60.0) {
      setGroupMessages(false);
    } else if (message?.senderId === lastMessage?.senderId) {
      setGroupMessages(true);
    }
  }, [message, lastMessage]);

  function formatMessageDate(createdOn: string) {
    const messageDate = new Date(createdOn);

    return messageDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
  }

  function formatMessageFullDate(createdOn: string) {
    const messageDate = new Date(createdOn);

    return messageDate
      .toLocaleTimeString("en-GB", {
        day: "numeric",
        month: "numeric",
      })
      .replace(",", "")
      .replace(/\d+:\d+:\d+/, "");
  }

  if (user?.id === message.senderId) {
    if (message.content.trim().length === 0) return null;
    return (
      <>
        {isAnotherDay && lastMessage?.createdOn && (
          <div
            className={`w-full flex justify-end relative
            mt-2
          `}
          >
            <div className="flex items-center justify-end gap-1 w-full">
              <div className="text-slate-950/80 rounded-md backdrop-blur-lg flex h-fit flex-col gap-2 min-w-16 w-full px-2">
                <Separator className="bg-slate-700/30 p-0.5"></Separator>
              </div>
              <p className="text-xs font-normal w-14 text-end">
                {lastMessage?.createdOn && (
                  <>{formatMessageFullDate(message.createdOn)}</>
                )}
              </p>
            </div>
          </div>
        )}
        <div
          className={`w-full flex justify-end relative
            mt-2
          `}
        >
          <div className="flex items-center justify-end gap-1">
            <div className="bg-blue-500/60 text-white px-4 py-2 rounded-md backdrop-blur-lg flex h-fit flex-col gap-2 min-w-16 max-w-60">
              {message.attachment.trim().length !== 0 && (
                <img src={message.attachment} alt="" className="rounded-lg" />
              )}
              {message.content}
            </div>
            <p className="text-xs font-normal w-14 text-end">
              {!groupMessages && <>{formatMessageDate(message.createdOn)}</>}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="w-full min-h-20 flex justify-start relative my-4">
      <div className="self-end max-w-60 flex flex-col justify-end">
        <p className="text-sm">{message.sender.username}</p>
        <div className="bg-slate-500/60 text-white px-4 py-2 rounded-md backdrop-blur-lg flex h-fit flex-col gap-2 min-w-16 shadow-lg">
          {message.attachment && (
            <img src={message.attachment} alt="" className="rounded-lg" />
          )}
          {message.content}
        </div>
        <p className="text-xs font-normal">
          {formatMessageDate(message.createdOn)}
        </p>
      </div>
    </div>
  );
}
