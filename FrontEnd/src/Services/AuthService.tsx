import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";

const api = "http://localhost:5100/api";

export const loginApi = async (username: string, password: string) => {
  try {
    const data = await axios.post<{
      id: string;
      username: string;
      token: string;
      email: string;
    }>(`${api}/account/login`, { username, password });
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
    console.log({ data });
    return data;
  } catch (e: any) {
    handleError(e);
    return e;
  }
};
