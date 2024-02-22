import { ToastContainer } from "react-toastify";
import { UserProvider } from "./Context/useAuth";
import Header from "./components/Header";
import { Outlet } from "react-router";
import axios from "axios";
import { useEffect } from "react";

function setBodyHeight() {
  document.body.style.height = window.innerHeight + "px";
  document.body.style.maxHeight = window.innerHeight + "px";
}

export default function App() {
  window.addEventListener("resize", setBodyHeight);
  window.addEventListener("load", setBodyHeight);

  return (
    <div className="h-full relative ">
      <ToastContainer />
      <UserProvider>
        <div className="m-auto max-w-[1024px] h-full relative margin-auto bg-slate-900 shadow-md">
          <Outlet />
        </div>
      </UserProvider>
    </div>
  );
}
