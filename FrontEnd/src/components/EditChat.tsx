import { MdEdit } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import React, { useEffect } from "react";
import { Attachment } from "./ProfileOptions";
import { ChatService, MessageEnum } from "@/Services/ChatService";
import { toast } from "react-toastify";
import { InviteToChatType, UserService } from "@/Services/UserService";
import { useAuth } from "@/Context/useAuth";
import { IoIosSave } from "react-icons/io";
import { set } from "react-hook-form";

export const EditChat = ({
  chatService,
  selectedChat,
  setAllChats,
}: {
  chatService: ChatService;
  selectedChat: InviteToChatType;
  setAllChats: any;
}) => {
  const { user, getToken, logout, updateUser } = useAuth();
  const [rawFile, setRawFile] = React.useState<File | null>(null);
  const [loadedAttachment, setLoadedAttachment] =
    React.useState<Attachment | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  useEffect(() => {
    setLoadedAttachment({
      content: selectedChat.chatGroup?.logo!,
      path: selectedChat.chatGroup?.logo!,
      type: MessageEnum.Image,
    });
  }, []);

  const loadAttachment = async (e: any) => {
    const file = e.target.files[0];

    setRawFile(file);
    const reader = new FileReader();

    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const percentage = (e.loaded / e.total) * 100;
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
    };

    reader.readAsDataURL(file);
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

  const saveChanges = async (e: any) => {
    e.preventDefault();

    const type = checkAttachmentType(loadedAttachment?.path.toString() || "");

    const form = new FormData(e.target);
    const name = form.get("name")?.toString() || selectedChat.chatGroup.name;

    if (type !== MessageEnum.Image) {
      toast.error("Only images are allowed");
      return;
    }

    let attachmentUrl = "";

    if (rawFile) {
      attachmentUrl = await chatService.uploadAttachment(rawFile, user?.id!);
    }

    chatService.updateChat(selectedChat.chatGroup.id, name, attachmentUrl);

    setIsModalOpen(false);
    setAllChats((prev: InviteToChatType[]) => {
      const index = prev.findIndex(
        (chat: InviteToChatType) =>
          chat.chatGroup.id === selectedChat.chatGroup.id
      );
      prev[index].chatGroup.name = name;
      prev[index].chatGroup.logo = attachmentUrl;
      return prev;
    });
  };
  return (
    <form onSubmit={saveChanges} className="px-4 py-4 flex flex-col gap-2">
      <h3 className="text-2xl font-semibold text-gray-300">Chat Settings</h3>
      <div className="flex gap-4 items-center mt-4">
        <input
          type="file"
          name="logo"
          id="logo"
          className="hidden"
          onChange={loadAttachment}
        />
        <label
          htmlFor="logo"
          className="cursor-pointer group relative h-16 w-16 overflow-hidden"
        >
          <Avatar className="h-16 w-16">
            <AvatarImage
              className="object-cover"
              src={loadedAttachment?.content}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="hidden group-hover:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all bg-gray-800/20 backdrop-blur-0 hover:backdrop-blur-sm h-full w-full items-center justify-center rounded-full">
            <MdEdit className="text-white" />
          </div>
        </label>
        <div className="flex items-center px-2 pl-4 py-2 gap-2 border-b-2 border-gray-300">
          <input
            type="text"
            name="name"
            id="name"
            className="text-gray-200 outline-none bg-transparent w-60 text-xl"
            placeholder={selectedChat.chatGroup.name}
          />
        </div>
      </div>
      <button
        onClick={() => {}}
        className="w-fit bg-blue-950/80 text-sm px-2 py-2 mt-4  h-full flex gap-2 items-center justify-center relative rounded-md text-gray-300 hover:brightness-125 transition-all"
      >
        Save
        <IoIosSave size={20} />
      </button>
    </form>
  );
};
