import React, { createContext, useEffect, useState } from "react";
import { UserProfile } from "../Models/User";
import { useNavigate } from "react-router";
import { loginApi, logoutApi, registerApi } from "../Services/AuthService";
import { toast } from "react-toastify";
import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";

type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  registerUser: (email: string, username: string, password: string) => void;
  loginUser: (username: string, password: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
};

type Props = {
  children: React.ReactNode;
};

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // not safe, I know
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      setUser(JSON.parse(user));
      setToken(token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setIsReady(true);
  }, []);

  const registerUser = async (
    email: string,
    username: string,
    password: string
  ) => {
    try {
      const response = await registerApi(email, username, password, "none");
      if (
        (response.response && response.response.status == 400) ||
        response.status == 500
      ) {
        toast.error((response.response.data as any)[0].description);
        return;
      }
      if (response.status != 200) {
        toast.error("Server error, registration failed");
        return;
      }

      localStorage.setItem("token", response.data.token);
      const userObj = {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
      };
      localStorage.setItem("user", JSON.stringify(userObj));
      setToken(response.data.token);
      setUser(userObj);
      toast.success("Registered successfully");
      navigate("/");
    } catch (e: any) {
      handleError(e);
      toast.error(e.message);
    }
  };

  const loginUser = async (username: string, password: string) => {
    try {
      const response = await loginApi(username, password);
      if (!response) return;

      localStorage.setItem("token", response.data.token);
      const userObj = {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
      };
      localStorage.setItem("user", JSON.stringify(userObj));
      setToken(response.data.token);
      setUser(userObj);
      toast.success("Registered successfully");
      navigate("/");
    } catch (e) {
      toast.error("Server error, login failed");
    }
  };

  const isLoggedIn = () => {
    return !!user;
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    navigate("/");
  };

  return (
    <UserContext.Provider
      value={{ user, token, registerUser, loginUser, logout, isLoggedIn }}
    >
      {isReady && children}
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(UserContext);
};
