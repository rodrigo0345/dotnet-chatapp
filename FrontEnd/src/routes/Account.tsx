import { Navigate } from "react-router";
import { useAuth } from "../Context/useAuth";
import { logoutApi } from "../Services/AuthService";

export default function Account() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Account</h1>
      <p>Username: {user?.username}</p>
      <p>Email: {user?.email}</p>

      <button
        onClick={logout}
        className="bg-red-600 px-2 py-1 rounded-md font-normal hover:bg-red-700 text-white"
      >
        Logout
      </button>
    </div>
  );
}
