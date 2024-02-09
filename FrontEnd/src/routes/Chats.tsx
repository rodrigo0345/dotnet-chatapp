import Chat from "../components/Chat";
import ChatList from "../components/ChatList";

export default function Chats() {
  return (
    <div className="grid grid-flow-row grid-cols-6 h-full">
      <ChatList></ChatList>
      <Chat></Chat>
    </div>
  );
}
