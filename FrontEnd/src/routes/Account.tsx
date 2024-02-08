import { useAuth } from "../Context/useAuth";

export default function Account() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Account</h1>
      <p>Username: {user?.username}</p>
      <p>Email: {user?.email}</p>
    </div>
  );
}
