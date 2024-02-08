import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Header from "./components/Header.tsx";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./Context/useAuth.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: "",
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToastContainer />
    <UserProvider>
      <Header></Header>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);
