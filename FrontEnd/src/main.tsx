import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Header from "./components/Header.tsx";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./Context/useAuth.tsx";
import App from "./App.tsx";
import Login from "./routes/Login.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [{ path: "login", element: <Login /> }],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
