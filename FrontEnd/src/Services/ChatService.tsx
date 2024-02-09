import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";
import { api } from "./AuthService";

type Chat = {};

export const getMyChats = async (userId: string) => {
  try {
    const data = await axios.get<Chat[]>(
      `${api}/chats?FilterValue=${userId}&FilterBy=UserId`
    );
    return data;
  } catch (e: any) {
    const { request } = handleError(e);
    return request;
  }
};
