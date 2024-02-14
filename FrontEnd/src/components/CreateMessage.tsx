import React, { FormEvent, useEffect, useRef, useState } from "react";
import { MessageType, MessageEnum, ChatService } from "../Services/ChatService";
import { toast } from "react-toastify";
import { InviteToChatType, UserService } from "../Services/UserService";
import { useAuth } from "@/Context/useAuth";
import { FaPlay, FaUserAstronaut } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { IoSend } from "react-icons/io5";
import { GrAttachment } from "react-icons/gr";
import { FaCheckCircle } from "react-icons/fa";
import { Progress } from "@/components/ui/progress";
import { object } from "yup";
import { IoMdRemoveCircle } from "react-icons/io";
import { set } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaPause } from "react-icons/fa";

export default function CreateMessage({
  group,
  setMessages,
  userService,
  chatService,
}: {
  group: InviteToChatType;
  setMessages: any;
  userService: UserService;
  chatService: ChatService;
}) {
  const { user } = useAuth();

  type Attachment = {
    type: MessageEnum;
    content: string;
    path: string;
  };

  const [loadedAttachment, setLoadedAttachment] = useState<Attachment | null>();
  const [loadingAttachment, setLoadingAttachment] = useState<number>(0.0);
  const [message, setMessage] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [rawFile, setRawFile] = useState<File | null>(null);

  const visualizerRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setIsPlaying(false);
    const groupId = group.id;
    const result = loadAttatchmentAndMessageSavedLocally(groupId).then(
      (result) => {
        if (result) {
          setMessage(result.message);

          if (result.attachment.content.trim().length == 0) {
            setLoadingAttachment(0);
            setLoadedAttachment(null);
            return;
          }
          setLoadedAttachment(result.attachment);
          setLoadingAttachment(100);
        }
      }
    );
  }, [group]);

  const loadAttachment = async (e: any) => {
    setIsPlaying(false);
    setLoadingAttachment(0.0);
    setLoadedAttachment(null);

    const file = e.target.files[0];

    setRawFile(file);
    const reader = new FileReader();

    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const percentage = (e.loaded / e.total) * 100;
        setLoadingAttachment(percentage);
      }
    };

    reader.onload = function (e) {
      const result = e.target?.result;
      if (!result) {
        toast.error("Error loading attachment");
        return;
      }

      const attachment: Attachment = {
        type: checkAttachmentType(file.name),
        content: result.toString(),
        path: file.name,
      };
      setLoadedAttachment(attachment);
      saveAttachmentAndMessageLocally(attachment, message, group.id);
    };

    reader.readAsDataURL(file);
  };

  const saveAttachmentAndMessageLocally = async (
    attachment: Attachment | null | undefined,
    message: string,
    groupId: string
  ) => {
    const localMessage = {
      attachment,
      message,
    };

    localStorage.setItem("message" + groupId, JSON.stringify(localMessage));
  };

  const loadAttatchmentAndMessageSavedLocally = async (groupId: string) => {
    const localMessage = localStorage.getItem("message" + groupId);
    if (!localMessage) {
      setMessage("");
      setLoadedAttachment(null);
      setLoadingAttachment(0.0);
      return;
    }

    const message = await JSON.parse(localMessage);

    return message;
  };

  const checkAttachmentType = (attachment: string) => {
    const attachmentType = attachment?.toString().split(".").pop();

    let type: MessageEnum = MessageEnum.Text;
    if (
      attachmentType === "png" ||
      attachmentType === "jpg" ||
      attachmentType === "jpeg" ||
      attachmentType === "gif"
    ) {
      // send image
      type = MessageEnum.Image;
    }

    if (attachmentType === "mp4") {
      // send video
      type = MessageEnum.Video;
    }

    if (attachmentType === "mp3") {
      // send audio
      type = MessageEnum.Audio;
    }
    return type;
  };

  const sendMessageComponent = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const content = formData.get("content");

    console.log({ rawFile, content });
    const type = checkAttachmentType(loadedAttachment?.path.toString() || "");

    let attachmentUrl = "";

    if (rawFile) {
      attachmentUrl = await chatService.uploadAttachment(
        rawFile,
        group.chatGroup.id
      );
    }

    console.log({ attachmentUrl });

    await chatService.sendMessage({
      chatGroupId: group.chatGroup.id,
      senderId: "autocomplete",
      content: content?.toString() || "",
      attachment: attachmentUrl ?? "",
      type,
    });

    setIsPlaying(false);
    setLoadedAttachment(null);
    setLoadingAttachment(0.0);
    setMessage("");
    localStorage.removeItem("message" + group.id);
    localStorage.removeItem("attachment" + group.id);
    e.currentTarget.reset();
  };

  return (
    <div className="row-span-1 self-end relative flex flex-col gap-2">
      {loadingAttachment > 0.0 && (
        <div className="px-3 py-3 mx-6 bg-slate-600/20 rounded-xl flex items-center justify-start shadow-lg w-fit absolute z-10 -translate-y-40 top-0 backdrop-blur-lg">
          {loadingAttachment !== 100 ? (
            <Progress value={loadingAttachment} color="#84cc16" className="" />
          ) : (
            <>
              <div className="h-32 w-32 transition-all bg-slate-600/100 rounded-lg shadow-lg relative group">
                <button
                  onClick={() => {
                    setLoadedAttachment(null);
                    setLoadingAttachment(0.0);
                    localStorage.removeItem("message" + group.id);
                  }}
                  className="hidden absolute right-0 top-0 text-red-600 p-1 rounded-full group-hover:flex transition-all duration-200 items-center justify-center "
                >
                  <IoMdRemoveCircle size={24} />
                </button>
                {loadedAttachment?.type === MessageEnum.Image && (
                  <img
                    className="object-cover h-full w-full rounded-md"
                    src={loadedAttachment?.content}
                    alt=""
                  />
                )}
                {loadedAttachment?.type === MessageEnum.Video && (
                  <div className="flex items-center justify-center h-full w-full text-gray-300">
                    <video
                      id="video-01"
                      className="object-cover h-full w-full rounded-md"
                      loop
                      src={loadedAttachment?.content}
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
                {loadedAttachment?.type === MessageEnum.Audio && (
                  <div className="flex items-center justify-center h-full w-full text-gray-300">
                    <audio
                      loop
                      id="audio-01"
                      className="hidden object-cover h-full w-full rounded-md"
                      src={loadedAttachment?.content}
                    ></audio>
                    <img
                      className="object-cover h-full w-full rounded-md grayscale "
                      src={
                        "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOG1rNWg0Y285ODNlemk3aGtscWV0cnI5bzdoeXcxdzhlYTljZmZndCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/XMaB779YCmP9m/giphy.gif"
                      }
                      alt=""
                    />

                    <button
                      className="absolute h-10 w-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-200"
                      onClick={() => {
                        const audio: any = document.getElementById("audio-01");

                        if (audio.paused) {
                          audio.play();
                          setIsPlaying(true);
                          return;
                        }
                        audio.pause();
                        setIsPlaying(false);
                      }}
                    >
                      {!isPlaying && <FaPlay size={25} />}
                      {isPlaying && <FaPause size={25} />}
                    </button>
                  </div>
                )}
                {loadedAttachment?.type === MessageEnum.PDF && (
                  <object
                    data={loadedAttachment?.content}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                  ></object>
                )}
              </div>
              <div className="flex items-center gap-2 px-5">
                <div className="text-green-400">
                  <FaCheckCircle />
                </div>
                <p className="text-gray-300">File uploaded!</p>
              </div>
            </>
          )}
        </div>
      )}
      <div className="flex self-end bg-zinc-950/30 justify-center w-full items-center p-2 rounded-lg border border-slate-700/80 shadow-lg">
        <div className="text-white w-10 h-10 flex items-center justify-center rounded-full">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>Profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <form
          onSubmit={sendMessageComponent}
          className="flex flex-row w-full items-center gap-2 "
        >
          <div className="flex flex-col gap-2 w-full grow-0">
            <input
              value={message}
              onChange={(e) => {
                setMessage(e.currentTarget.value);
                saveAttachmentAndMessageLocally(
                  loadedAttachment,
                  e.currentTarget.value,
                  group.id
                );
              }}
              autoComplete="off"
              name="content"
              type="text"
              placeholder="Type a message..."
              className="h-full py-1 px-2 text-sm outline-none text-gray-300 bg-transparent"
            ></input>
          </div>
          <input
            onChange={loadAttachment}
            className="hidden absolute"
            type="file"
            id="file-uploader"
            name="attachment"
            accept="image/*, video/*, audio/*"
          />
          <label
            htmlFor="file-uploader"
            className="text-sm flex justify-center items-center focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-300 cursor-pointer"
          >
            <GrAttachment />
          </label>
          <button
            type="submit"
            className="w-10 h-10 text-sm bg-blue-500 flex justify-center items-center rounded-full hover:bg-blue-500/40 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-950 hover:text-slate-200 disabled:bg-blue-500/40"
            {...(loadingAttachment > 0.0 &&
              loadingAttachment != 100 && { disabled: true })}
          >
            <IoSend />
          </button>
        </form>
      </div>
    </div>
  );
}
