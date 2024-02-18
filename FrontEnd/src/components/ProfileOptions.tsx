import { useAuth } from "@/Context/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { IoIosSettings } from "react-icons/io";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { MdEdit, MdLogout } from "react-icons/md";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { ChatService, MessageEnum } from "@/Services/ChatService";
import { updateUserApi } from "@/Services/AuthService";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export type Attachment = {
  type: MessageEnum;
  content: string;
  path: string;
};

export const ProfileOptions = ({
  className,
  chatService,
}: {
  className: string;
  chatService: ChatService;
}) => {
  const { user, getToken, logout, updateUser } = useAuth();
  const [rawFile, setRawFile] = React.useState<File | null>(null);
  const [loadedAttachment, setLoadedAttachment] =
    React.useState<Attachment | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  useEffect(() => {
    setLoadedAttachment({
      content: user?.logo!,
      path: user?.logo!,
      type: MessageEnum.Image,
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log(file);
  };

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

    const formData = new FormData(e.currentTarget);
    const content = formData.get("logo");

    const type = checkAttachmentType(loadedAttachment?.path.toString() || "");

    if (type !== MessageEnum.Image) {
      toast.error("Only images are allowed");
      return;
    }

    let attachmentUrl = "";

    if (rawFile) {
      attachmentUrl = await chatService.uploadAttachment(rawFile, user?.id!);
    }

    updateUserApi(
      {
        username: user?.username!,
        email: user?.email!,
        id: user?.id!,
        logo: attachmentUrl,
      },
      getToken()
    );

    updateUser({
      username: user?.username!,
      email: user?.email!,
      id: user?.id!,
      logo: attachmentUrl,
    });

    setIsModalOpen(false);
  };

  return (
    <div className="p-4 z-10 pr-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.logo} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0">
            <h1 className="text-gray-300 p-0">{user?.username}</h1>
            <h2 className="text-gray-500 text-xs">{user?.email}</h2>
          </div>
        </div>
        <Dialog onOpenChange={setIsModalOpen} open={isModalOpen}>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <button
                    onClick={() => {
                      setIsModalOpen(!isModalOpen);
                    }}
                    className="flex items-center"
                  >
                    <IoIosSettings
                      className="cursor-pointer text-gray-300 hover:text-gray-400"
                      size={20}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>User Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <button
                    onClick={() => {
                      logout();
                    }}
                    className="flex items-center"
                  >
                    <MdLogout
                      size={20}
                      className="cursor-pointer text-gray-300 hover:text-red-400"
                      onClick={logout}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Logout</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={saveChanges} className="flex flex-col gap-2">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Sorry but you are only allowed to change the photo.
                </DialogDescription>
              </DialogHeader>

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
                  <MdEdit />
                </div>
              </label>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
