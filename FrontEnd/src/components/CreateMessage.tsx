import React, { FormEvent } from "react";
import {
  ChatGroupProp,
  MessageResponse,
  MessageType,
  sendMessage,
} from "../Services/ChatService";
import { useAuth } from "../Context/useAuth";
import { toast } from "react-toastify";

export default function CreateMessage({
  group,
  setMessages,
  connection,
}: {
  group: ChatGroupProp;
  setMessages: any;
  connection: signalR.HubConnection;
}) {
  const { token, user } = useAuth();
  const sendMessageComponent = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const content = formData.get("content");
    const attachment = formData.get("attachment");
    const attachmentType = attachment?.toString().split(".").pop();

    let type: MessageType = MessageType.Text;
    if (
      attachmentType === "png" ||
      attachmentType === "jpg" ||
      (attachmentType === "jpeg" && !content)
    ) {
      // send image
      type = MessageType.Image;
    }

    if (attachmentType === "mp4" && !content) {
      // send video
      type = MessageType.Video;
    }

    if (attachmentType === "mp3" && !content) {
      // send audio
      type = MessageType.Audio;
    }

    if (!token || !user) {
      toast.error("You are not logged in");
      return;
    }

    await sendMessage(
      {
        chatGroupId: group.chatGroup.id,
        senderId: user?.id,
        content: content?.toString() || "",
        attachment: attachment?.toString() || "",
        type,
      },
      JSON.parse(token),
      connection
    );

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
