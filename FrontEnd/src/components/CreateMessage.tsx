import React, { FormEvent } from "react";
import { MessageType, MessageEnum, ChatService } from "../Services/ChatService";
import { toast } from "react-toastify";
import { InviteToChatType, UserService } from "../Services/UserService";

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
  const sendMessageComponent = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const content = formData.get("content");
    const attachment = formData.get("attachment");
    const attachmentType = attachment?.toString().split(".").pop();

    let type: MessageEnum = MessageEnum.Text;
    if (
      attachmentType === "png" ||
      attachmentType === "jpg" ||
      (attachmentType === "jpeg" && !content)
    ) {
      // send image
      type = MessageEnum.Image;
    }

    if (attachmentType === "mp4" && !content) {
      // send video
      type = MessageEnum.Video;
    }

    if (attachmentType === "mp3" && !content) {
      // send audio
      type = MessageEnum.Audio;
    }

    await chatService.sendMessage({
      chatGroupId: group.chatGroup.id,
      senderId: "autocomplete",
      content: content?.toString() || "",
      attachment: attachment?.toString() || "",
      type,
    });

    e.currentTarget.reset();
  };

  return (
    <div className="flex flex-col self-end bg-gray-700 justify-center w-full items-center">
      <form
        onSubmit={sendMessageComponent}
        className="flex flex-row w-full p-3 items-center gap-2 "
      >
        <div className="flex flex-col gap-2 w-full">
          <input
            name="attachment"
            type="text"
            placeholder="Image link"
            className="h-full py-1 px-2 text-sm outline-none"
          ></input>
          <input
            name="content"
            type="text"
            placeholder="Type a message"
            className="h-full py-1 px-2 text-sm outline-none"
          ></input>
        </div>
        <button
          type="submit"
          className="w-1/6 text-sm bg-green-500 h-full text-white"
        >
          Send
        </button>
      </form>
    </div>
  );
}
