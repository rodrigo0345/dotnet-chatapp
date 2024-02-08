import { ToastContainer } from "react-toastify";
import { UserProvider } from "./Context/useAuth";
import Header from "./components/Header";
import { Outlet } from "react-router";

export default function App() {
  return (
    <>
      <ToastContainer />
      <UserProvider>
        <Header></Header>
        <Outlet />
      </UserProvider>
    </>
  );
}
