import { ChatGroupProp } from "../Services/ChatService";
import ChatFeed from "./ChatFeed";
import CreateMessage from "./CreateMessage";

export default function Chat({
  mainChat,
}: {
  mainChat?: ChatGroupProp | null;
}) {
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
          <section className="flex gap-2 w-full bg-gray-700 text-white p-4 align-middle items-center">
            <img
              src={mainChat.chatGroup.logo}
              alt="group photo"
              className="w-10 h-10 rounded-full object-cover object-center"
            />
            <h1 className="font-normal text-lg">{mainChat.chatGroup.name}</h1>
          </section>
          <ChatFeed {...mainChat}></ChatFeed>
          <CreateMessage {...mainChat}></CreateMessage>
        </div>
      )}
    </>
  );
}
