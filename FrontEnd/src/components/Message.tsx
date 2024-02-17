import { useEffect, useState } from "react";
import { useAuth } from "../Context/useAuth";
import { MessageEnum, MessageType } from "../Services/ChatService";
import { set } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { FaPause, FaPlay } from "react-icons/fa";

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
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

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

    if (timeDifference > 10.0) {
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
        year: "2-digit",
      })
      .replace(",", "")
      .replace(/\d+:\d+:\d+/, "");
  }

  if (user?.id === message.senderId) {
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
              <p className="text-xs font-normal w-14 text-end text-gray-400">
                {lastMessage?.createdOn && (
                  <>{formatMessageFullDate(message.createdOn)}</>
                )}
              </p>
            </div>
          </div>
        )}
        {message.attachment.trim().length !== 0 && (
          <div
            className={`w-full flex justify-end relative mt-2
          `}
          >
            <div className="flex items-center justify-end gap-1 px-1">
              {message.attachment.trim().length !== 0 &&
                message.type == MessageEnum.Image && (
                  <img
                    src={message.attachment}
                    alt=""
                    className="rounded-lg w-40"
                  />
                )}
              {message.attachment.trim().length !== 0 &&
                message.type == MessageEnum.Video && (
                  <div className="flex items-center justify-center h-full max-w-96 relative pl-10">
                    <video
                      id="video-01"
                      className="object-cover h-full w-full rounded-md"
                      loop
                      src={message?.attachment}
                      controls
                    ></video>

                    <button
                      className="absolute h-10 w-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-200"
                      onClick={() => {
                        const videoElement: any =
                          document.getElementById("video-01");

                        if (videoElement.paused) {
                          videoElement.play();
                          setIsPlaying(true);
                        } else {
                          videoElement.pause();
                          setIsPlaying(false);
                        }
                      }}
                    >
                      {!isPlaying && <FaPlay size={25} />}
                      {isPlaying && <FaPause size={25} />}
                    </button>
                  </div>
                )}
            </div>
            <p className="text-xs font-normal w-14 text-end text-gray-400"></p>
          </div>
        )}
        <div
          className={`w-full flex justify-end relative
            mt-2
          `}
        >
          <div className="flex items-center justify-end gap-1 h-fit">
            <div className="bg-blue-500/60 text-white px-4 py-2 rounded-md backdrop-blur-lg flex h-fit flex-col gap-2 min-w-16 max-w-60">
              {message.content}
            </div>
            <p className="text-xs font-normal w-14 text-end text-gray-400">
              {!groupMessages && <>{formatMessageDate(message.createdOn)}</>}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {isAnotherDay && lastMessage?.createdOn && (
        <div
          className={`w-full flex justify-end relative
            mt-4
          `}
        >
          <div className="flex items-center justify-end gap-1 w-full">
            <div className="text-slate-950/80 rounded-md backdrop-blur-lg flex h-fit flex-col gap-2 min-w-16 w-full px-2">
              <Separator className="bg-slate-700/30 p-0.5"></Separator>
            </div>
            <p className="text-xs font-normal w-14 text-end text-gray-400">
              {lastMessage?.createdOn && (
                <>{formatMessageFullDate(message.createdOn)}</>
              )}
            </p>
          </div>
        </div>
      )}
      <div
        className={`w-full flex justify-start relative
            ${groupMessages ? "mt-2" : "mt-4"}
          `}
      >
        {message.attachment.trim().length !== 0 &&
          message.type == MessageEnum.Image && (
            <div className="flex items-center justify-start gap-1 pl-10 w-full">
              {message.attachment.trim().length !== 0 && (
                <img
                  src={message.attachment}
                  alt=""
                  className="rounded-lg max-w-40"
                />
              )}
            </div>
          )}
        {message.attachment.trim().length !== 0 &&
          message.type == MessageEnum.Video && (
            <div className="flex items-end justify-end h-full w-96 relative pl-10">
              <video
                id="video-01"
                className="object-cover h-full w-full rounded-md"
                loop
                src={message?.attachment}
                controls
              ></video>

              <button
                className="absolute h-10 w-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-200"
                onClick={() => {
                  const videoElement: any = document.getElementById("video-01");

                  if (videoElement.paused) {
                    videoElement.play();
                    setIsPlaying(true);
                  } else {
                    videoElement.pause();
                    setIsPlaying(false);
                  }
                }}
              >
                {!isPlaying && <FaPlay size={25} />}
                {isPlaying && <FaPause size={25} />}
              </button>
            </div>
          )}
        <p className="text-xs font-normal w-14 text-end text-gray-400"></p>
      </div>
      <div
        className={`w-full flex justify-start relative
            ${groupMessages ? "mt-1" : "mt-4"}
          `}
      >
        <div className="flex items-center justify-between gap-1 w-full">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              {!groupMessages && (
                <HoverCard>
                  <HoverCardTrigger>
                    <AvatarImage
                      className="cursor-help object-cover"
                      src="https://georgiapoliticalreview.com/wp-content/uploads/2014/04/Finn-The-Human.jpg"
                    />
                    <AvatarFallback className="h-8 w-8 object-cover">
                      CN
                    </AvatarFallback>
                  </HoverCardTrigger>
                  <HoverCardContent className="bg-slate-800 border-none text-gray-300">
                    <div>
                      <p className="text-lg font-bold">
                        {message.sender.username}
                      </p>
                      <p className="text-sm">
                        <a href="mailto:" className="text-blue-500">
                          {message.sender.email}
                        </a>
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}
            </Avatar>
            <div className="bg-slate-600/40 text-white px-4 py-2 rounded-md backdrop-blur-lg flex h-fit flex-col gap-2 min-w-16 max-w-60">
              {message.content}
            </div>
          </div>
          <p className="text-xs font-normal w-14 text-end text-gray-400">
            {!groupMessages && <>{formatMessageDate(message.createdOn)}</>}
          </p>
        </div>
      </div>
    </>
  );
}
