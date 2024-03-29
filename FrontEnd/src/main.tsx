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
import Chats from "./routes/Chats.tsx";
import Register from "./routes/Register.tsx";
import Account from "./routes/Account.tsx";
import Protected from "./routes/Protected.tsx";
import { ProtectedRoute } from "./routes/ProtectedRoute.tsx";
import TermsOfUse from "./routes/TermsOfUse.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "termsOfUse", element: <TermsOfUse /> },
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Protected />
          </ProtectedRoute>
        ),
        children: [
          { path: "account", element: <Account /> },
          { path: "", element: <Chats /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
