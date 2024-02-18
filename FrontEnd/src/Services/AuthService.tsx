import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";
import { UserProfile } from "@/Models/User";

export const api = "http://localhost:5100/api";

export const loginApi = async (username: string, password: string) => {
  try {
    const data = await axios.post<{
      id: string;
      username: string;
      token: string;
      email: string;
      logo: string;
    }>(`${api}/account/login`, { username, password });
    console.error({ data });
    return data;
  } catch (e: any) {
    handleError(e);
  }
};

export const registerApi = async (
  email: string,
  username: string,
  password: string,
  bio: string
) => {
  try {
    const data = await axios.post<{
      username: string;
      email: string;
      password: string;
      id: string;
    }>(`${api}/account/register`, { email, username, password, bio: "none" });
    return data;
  } catch (e: any) {
    handleError(e);
    return e;
  }
};

export const logoutApi = async () => {
  try {
    const data = await axios.post(`${api}/account/logout`);
    return data;
  } catch (e: any) {
    handleError(e);
  }
};

export const updateUser = async (user: UserProfile, token: string) => {
  try {
    const data = await axios.put(
      `${api}/account`,
      {
        ...user,
        Bio: "",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (e: any) {
    handleError(e);
  }
};
