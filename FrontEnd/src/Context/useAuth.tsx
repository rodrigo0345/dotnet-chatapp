import React, { createContext, useEffect, useState } from "react";
import { UserProfile } from "../Models/User";
import { useNavigate } from "react-router";
import { loginApi, registerApi } from "../Services/AuthService";
import { toast } from "react-toastify";
import axios from "axios";

type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  registerUser: (
    email: string,
    username: string,
    password: string,
    bio: string
  ) => void;
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
    password: string,
    bio: string
  ) => {
    try {
      const response = await registerApi(email, username, password, bio);
      if (!response) return;

      localStorage.setItem("token", response.data.Token);
      const userObj = {
        id: response.data.Id,
        username: response.data.Username,
        email: response.data.Email,
      };
      localStorage.setItem("user", JSON.stringify(userObj));
      setToken(response.data.Token);
      setUser(userObj);
      toast.success("Registered successfully");
      navigate("chats");
    } catch (e) {
      toast.error("Server error, registration failed");
    }
  };

  const loginUser = async (username: string, password: string) => {
    try {
      const response = await loginApi(username, password);
      if (!response) return;

      localStorage.setItem("token", response.data.Token);
      const userObj = {
        id: response.data.Id,
        username: response.data.Username,
        email: response.data.Email,
      };
      localStorage.setItem("user", JSON.stringify(userObj));
      setToken(response.data.Token);
      setUser(userObj);
      toast.success("Registered successfully");
      navigate("chats");
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