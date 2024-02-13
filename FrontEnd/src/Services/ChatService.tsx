import axios, { AxiosResponse } from "axios";
import { handleError } from "../helpers/ErrorHandler";
import { api } from "./AuthService";
import { toast } from "react-toastify";
import * as signalR from "@microsoft/signalr";
import { InviteToChatType } from "./UserService";

export enum MessageEnum {
  Text = 0,
  Image = 1,
  Video = 2,
  Audio = 3,
  File = 4,
  PDF = 5,
}

export type MessageCreateType = {
  chatGroupId: string;
  senderId: string;
  content: string;
  attachment: string;
  type: MessageEnum;
};

export type MessageType = {
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

export class ChatService {
  connection: signalR.HubConnection;

  _token: string;
  _isListening = false;
  _serverUrl: string;
  _userId: string;

  constructor(
    userId: string,
    token: string,
    serverUrl: string = "http://localhost:5100/api"
  ) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${serverUrl}/chatHub`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();
    this._token = token;
    this._serverUrl = serverUrl;
    this._userId = userId;
  }

  getChatMessages = async (
    chatId: string,
    pageNumber: number = 1
  ): Promise<AxiosResponse<MessageType[], any>> => {
    try {
      const data = await axios.get<MessageType[]>(
        `${api}/message?FilterValue=${chatId}&FilterBy='ChatGroupId'&ChatGroupId=${chatId}&IsDescending=true&PageSize=20&PageNumber=${pageNumber}`,
        {
          headers: {
            Authorization: `Bearer ${this._token}`,
          },
        }
      );
      return data;
    } catch (e: any) {
      const { request } = handleError(e);
      return request;
    }
  };

  sendMessage = async (message: MessageCreateType) => {
    if (!this.connection.state) await this.connection.start();
    try {
      message.senderId = this._userId;
      await this.connection.invoke("SendMessage", message);
    } catch (e) {
      console.error(e);
    }
  };

  joinChatRoom = async (chatGroupId: string, setMessages: any) => {
    if (this._isListening) return;

    console.log({ chatGroupId });

    try {
      await this.connection.start();
    } catch (e) {
      console.error(e);
    }

    this.connection.on("ReceiveMessage", (message: MessageType) => {
      setMessages((prev: MessageType[]) => {
        if (prev.some((m) => m.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });
    });

    try {
      await this.connection.invoke("JoinChat", this._userId, chatGroupId);
      this._isListening = true;
    } catch (e) {}
  };

  leaveChatRoom = async (chatGroupId: string) => {
    try {
      this._isListening = false;
      await this.connection.invoke("LeaveChat", this._userId, chatGroupId);
    } catch (e) {
      console.error(e);
    }
  };

  inviteToChat = async (chatGroupId: string, username: string) => {
    try {
      const invite = await axios.post<InviteToChatType>(
        `${this._serverUrl}/chats/invite`,
        {
          chatGroupId,
          userName: username,
        },
        {
          headers: {
            Authorization: `Bearer ${this._token}`,
          },
        }
      );
      toast.success("Invited");
      return invite;
    } catch (e: any) {
      const { request } = handleError(e);
      return request;
    }
  };
}
