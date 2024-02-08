import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";

const api = "http://localhost:5100/api";

export const loginApi = async (username: string, password: string) => {
  try {
    const data = await axios.post<{
      Id: string;
      Username: string;
      Token: string;
      Email: string;
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
      Username: string;
      Email: string;
      Token: string;
      Id: string;
    }>(`${api}/account/register`, { email, username, password, bio });
    return data;
  } catch (e: any) {
    handleError(e);
  }
};
