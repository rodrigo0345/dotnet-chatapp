export default function Header() {
  return (
    <header className="flex justify-around min-h-6 shadow-sm p-4 border border-b-2">
      <h1 className="text-lg text-gray-800 font-semibold">
        <a href="/">Simple Chat</a>
      </h1>
      <ul className="flex justify-between gap-4">
        <li>
          <a href={`/chats`}>Chats</a>
        </li>
        <li>
          <a href={`/account`}>Account</a>
        </li>
      </ul>
    </header>
  );
}
