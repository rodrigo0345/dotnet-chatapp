import { useState } from "react";
import { ChatGroupProp, MessageResponse } from "../Services/ChatService";
import ChatFeed from "./ChatFeed";
import CreateMessage from "./CreateMessage";
import { set } from "react-hook-form";
import Invite from "./Invite";

export default function Chat({
  mainChat,
}: {
  mainChat?: ChatGroupProp | null;
}) {
  const [messages, setMessages] = useState<MessageResponse[]>([]);

  if (mainChat === null) {
    return (
      <div className="flex h-full w-full justify-center items-center">
        <h1 className="animate-ping">Loading...</h1>
      </div>
    );
  }
  return (
    <>
      {mainChat && (
        <div className="col-span-4 h-fit relative flex flex-col">
          <section className="flex gap-2 w-full bg-gray-700 text-white p-4 justify-around align-middle items-center">
            <div className="flex items-center gap-2">
              <img
                src={mainChat.chatGroup.logo}
                alt="group photo"
                className="w-10 h-10 rounded-full object-cover object-center"
              />
              <h1 className="font-normal text-lg">{mainChat.chatGroup.name}</h1>
            </div>
            <Invite chatGroup={mainChat}></Invite>
          </section>
          <ChatFeed
            messages={messages}
            setMessages={setMessages}
            group={mainChat}
          ></ChatFeed>
          <CreateMessage
            group={mainChat}
            setMessages={setMessages}
            {...mainChat}
          ></CreateMessage>
        </div>
      )}
    </>
  );
}
