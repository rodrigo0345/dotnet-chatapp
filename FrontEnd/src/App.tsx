import { ToastContainer } from "react-toastify";
import { UserProvider } from "./Context/useAuth";
import Header from "./components/Header";
import { Outlet } from "react-router";
import axios from "axios";
import { useEffect } from "react";

export default function App() {
  return (
    <>
      <ToastContainer />
      <UserProvider>
        <Header></Header>
        <div className="m-auto max-w-[1024px] margin-auto">
          <Outlet />
        </div>
      </UserProvider>
    </>
  );
}
