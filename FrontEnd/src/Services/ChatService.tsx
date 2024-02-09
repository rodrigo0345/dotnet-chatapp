import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";
import { api } from "./AuthService";

export type ChatProp = {};

export const getMyChats = async (userId: string) => {
  try {
    const data = await axios.get<ChatProp[]>(
      `${api}/chats?FilterValue=${userId}&FilterBy=UserId`
    );
    return data;
  } catch (e: any) {
    const { request } = handleError(e);
    return request;
  }
};

export const createChat = async (chatName: string, chatLogo: string) => {
  try {
    const data = await axios.post<ChatProp>(`${api}/group`, {
      name: chatName,
      logo: chatLogo,
    });
    return data;
  } catch (e: any) {
    const { request } = handleError(e);
    return request;
  }
};
