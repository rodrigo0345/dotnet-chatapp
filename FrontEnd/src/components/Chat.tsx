import { useEffect, useState } from "react";
import { ChatGroupProp, MessageResponse } from "../Services/ChatService";
import ChatFeed from "./ChatFeed";
import CreateMessage from "./CreateMessage";
import { set } from "react-hook-form";
import Invite from "./Invite";
import * as signalR from "@microsoft/signalr";
import { api } from "../Services/AuthService";

export default function Chat({
  mainChat,
}: {
  mainChat?: ChatGroupProp | null;
}) {
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [connection, setConnection] = useState<signalR.HubConnection>(
    new signalR.HubConnectionBuilder()
      .withUrl(`${api}/chatHub`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .configureLogging(signalR.LogLevel.Information)
      .build()
  );

  useEffect(() => {
    connection.start().then(() => {
      console.log("connected");
    });
  }, []);

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
            connection={connection}
          ></ChatFeed>
          <CreateMessage
            group={mainChat}
            setMessages={setMessages}
            {...mainChat}
            connection={connection}
          ></CreateMessage>
        </div>
      )}
    </>
  );
}
