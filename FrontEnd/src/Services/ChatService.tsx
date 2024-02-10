import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";
import { api } from "./AuthService";
import { toast } from "react-toastify";

export type ChatProp = {
  id: string;
  name: string;
  logo: string;
  ownerId: string;
};

export type ChatGroupProp = {
  id: string;
  chatGroup: {
    id: string;
    name: string;
    logo: string;
    userId: string;
  };
  isAccepted: boolean;
  isAdmin: boolean;
  isBanned: boolean;
};

export const getMyChats = async (userId: string) => {
  try {
    const data = await axios.get<ChatGroupProp[]>(
      `${api}/chats?FilterValue=${userId}&FilterBy=UserId`
    );
    return data;
  } catch (e: any) {
    const { request } = handleError(e);
    return request;
  }
};

export const createChat = async (
  chatName: string,
  chatLogo: string,
  userToken: string
) => {
  try {
    // create it
    const data = await axios.post<ChatProp>(
      `${api}/group`,
      {
        name: chatName,
        logo: chatLogo,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    // now join it
    const joinData = await axios.post<ChatGroupProp>(
      `${api}/chats`,
      {
        chatGroupId: data.data.id,
        isAccepted: true,
        isAdmin: true,
        isBanned: false,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    toast.success("Chat created");
    return joinData;
  } catch (error) {
    console.error(error);

    // Assuming handleError function is correctly defined
    const { request } = handleError(error);
    return request;
  }
};

export const getChatMessages = async (
  chatId: string,
  userToken: string,
  pageNumber: number = 1
) => {
  try {
    const data = await axios.get(
      `${api}/message?FilterValue=${chatId}&FilterBy='ChatGroupId'&ChatGroupId=${chatId}&IsDescending=false&PageSize=10&PageNumber=${pageNumber}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return data;
  } catch (e: any) {
    const { request } = handleError(e);
    return request;
  }
};

export enum MessageType {
  Text = 0,
  Image = 1,
  Video = 2,
  Audio = 3,
  File = 4,
}

export type Message = {
  chatGroupId: string;
  senderId: string;
  content: string;
  attachment: string;
  type: MessageType;
};

export type MessageResponse = {
  attachment: string;
  chatGroupId: string;
  content: string;
  id: string;
  senderId: string;
  type: number;
  createdOn: string;
  sender: {
    id: string;
    username: string;
    email: string;
    password: string;
    bio: string;
  };
};

export const sendMessage = async (message: Message, userToken: string) => {
  try {
    const data = await axios.post<MessageResponse>(`${api}/message`, message, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return data;
  } catch (e: any) {
    const { request } = handleError(e);
    return request;
  }
};
