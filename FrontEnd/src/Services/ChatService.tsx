import axios, { AxiosResponse } from "axios";
import { handleError } from "../helpers/ErrorHandler";
import { api } from "./AuthService";
import { toast } from "react-toastify";
import * as signalR from "@microsoft/signalr";
import { InviteToChatType } from "./UserService";
import { UserProfile } from "@/Models/User";

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
    logo: string;
  };
};

export class ChatService {
  _connection: signalR.HubConnection;
  _token: string;

  _isListening = false;
  _isListeningForChatChanges = false;

  _serverUrl: string;
  _userId: string;

  constructor(
    userId: string,
    token: string,
    connection: signalR.HubConnection,
    serverUrl: string = "http://localhost:5100/api"
  ) {
    this._token = token;
    this._serverUrl = serverUrl;
    this._userId = userId;
    this._connection = connection;
  }

  getChatMessages = async (
    chatId: string,
    pageNumber: number = 1
  ): Promise<AxiosResponse<MessageType[], any>> => {
    if (!this._token) {
      return Promise.reject("No token");
    }
    try {
      const data = await axios.get<MessageType[]>(
        `${api}/message?FilterValue=${chatId}&FilterBy='ChatGroupId'&ChatGroupId=${chatId}&IsDescending=true&PageSize=30&Page=${pageNumber}`,
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
    if (!this._connection.state) await this._connection.start();
    try {
      message.senderId = this._userId;
      await this._connection.invoke("SendMessage", message);
    } catch (e) {}
  };

  joinChatRoom = async (
    chatGroupId: string,
    setMessages: any,
    setInvite: any
  ) => {
    if (this._isListening) return;

    try {
      await this._connection.start();
    } catch (e) {}

    this._connection.on("ReceiveMessage", (message: MessageType) => {
      setMessages((prev: MessageType[]) => {
        if (prev.some((m) => m.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });
      setInvite((prev: InviteToChatType[]) => {
        if (prev.some((m) => m.chatGroup.id === message.chatGroupId)) {
          return prev.map((chat) => {
            if (chat.chatGroup.id === message.chatGroupId) {
              return {
                ...chat,
                lastMessage: message,
                seenLastMessage: true,
              };
            }
            return chat;
          });
        }
      });

      this.markChatAsSeen(chatGroupId);
    });

    // mark messages as seen
    this.markChatAsSeen(chatGroupId);
    setInvite((prev: InviteToChatType[]) => {
      if (prev.some((m) => m.chatGroup.id === chatGroupId)) {
        return prev.map((chat) => {
          if (chat.chatGroup.id === chatGroupId) {
            return {
              ...chat,
              seenLastMessage: true,
            };
          }
          return chat;
        });
      }
    });

    try {
      await this._connection.invoke("JoinChat", this._userId, chatGroupId);
      this._isListening = true;
    } catch (e) {}
  };

  markChatAsSeen = async (chatGroupId: string) => {
    if (!this._token) {
      return;
    }
    try {
      const data = await axios.post(
        `${api}/chats/seen`,
        {
          groupId: chatGroupId,
        },
        {
          headers: {
            Authorization: `Bearer ${this._token}`,
          },
        }
      );
      return data;
    } catch (e) {
      handleError(e);
    }
  };

  leaveChatRoom = async (chatGroupId: string) => {
    try {
      this._isListening = false;
      await this._connection.invoke("LeaveChat", this._userId, chatGroupId);
    } catch (e) {}
  };

  inviteToChat = async (chatGroupId: string, username: string) => {
    if (!this._token) {
      return;
    }
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
      toast.success(`Invited ${username}`);
      return invite;
    } catch (e: any) {
      const { request } = handleError(e);
      return request;
    }
  };

  uploadAttachment = async (file: File, groupId: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("groupId", groupId);
    try {
      const data = await axios.post(`${api}/file`, formData);
      return data.data;
    } catch (e) {
      handleError(e);
      return null;
    }
  };

  listenForChatChanges = async (
    chatGroupId: string,
    setAllChats: any,
    selectedChat: InviteToChatType | null
  ) => {
    if (this._isListeningForChatChanges) return;
    this._connection.start().catch((e) => {});
    this._connection.on("Listening", (message: MessageType) => {
      setAllChats((prev: InviteToChatType[]) => {
        console.log({ prev });
        if (prev.some((m) => m.chatGroup.id === message.chatGroupId)) {
          const chat = prev.find((m) => m.chatGroup.id === message.chatGroupId);

          if (chat == null) return prev;

          prev = prev.filter((m) => m.chatGroup.id !== message.chatGroupId);
          return [
            {
              ...chat,
              lastMessage: message,
              seenLastMessage:
                selectedChat &&
                selectedChat.chatGroup.id === message.chatGroupId
                  ? true
                  : false,
            },
            ...prev,
          ];
        }
        return prev;
      });
    });

    try {
      await this._connection.invoke(
        "ListeningForChatMessages",
        this._userId,
        chatGroupId
      );
      this._isListeningForChatChanges = true;
    } catch (e) {
      console.error(e);
    }
  };

  getPeopleInChat = async (chatGroupId: string) => {
    try {
      const data = await axios.get<UserProfile[]>(
        `${api}/account?FilterBy=ChatGroupId&FilterValue=${chatGroupId}&PageSize=100&Page=1`,
        {
          headers: {
            Authorization: `Bearer ${this._token}`,
          },
        }
      );
      return data;
    } catch (e) {
      handleError(e);
    }
  };

  updateChat = async (chatGroupId: string, name: string, logo: string) => {
    try {
      const data = await axios.put(
        `${api}/group`,
        {
          id: chatGroupId,
          name,
          logo,
        },
        {
          headers: {
            Authorization: `Bearer ${this._token}`,
          },
        }
      );
      toast.success("Chat updated");
      return data;
    } catch (e) {
      handleError(e);
    }
  };
}
