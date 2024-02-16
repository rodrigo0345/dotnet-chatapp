import axios, { AxiosResponse } from "axios";
import { handleError } from "../helpers/ErrorHandler";
import { toast } from "react-toastify";

export type ChatType = {
  id: string;
  name: string;
  logo: string;
  ownerId: string;
};

export type InviteToChatType = {
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
  lastMessage: {
    id: string;
    chatGroupId: string;
    senderId: string;
    content: string;
    attachment: string;
    type: number;
    createdOn: string;
  };
  seenLastMessage: boolean;
};

export class UserService {
  _connection: signalR.HubConnection;
  _token: string;
  _userId: string;
  _serverUrl: string;
  _isListening: boolean = false;

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

  saveLastOpenChat = (chatId: string) => {
    console.log("saving last chat", chatId);
    localStorage.setItem("lastChat", chatId);
  };

  getLastOpenChat = () => {
    return localStorage.getItem("lastChat");
  };

  listenForPersonalEvents = async (
    userId: string,
    setInvites: (m: any) => any
  ) => {
    if (this._isListening) return;

    try {
      await this._connection.start();
    } catch (e) {
      console.error(e);
    }

    this._connection.on("ChatGroupInvite", (message: InviteToChatType) => {
      setInvites((prev: InviteToChatType[]) => {
        if (prev.some((m) => m.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });
    });

    this._isListening = true;
  };

  getMyChats = async (): Promise<AxiosResponse<InviteToChatType[], any>> => {
    try {
      const data = await axios.get<InviteToChatType[]>(
        `${this._serverUrl}/chats?FilterValue=${this._userId}&FilterBy=UserId`,
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

  getChat = async (chatId: string) => {
    try {
      const data = await axios.get<ChatType>(
        `${this._serverUrl}/group/${chatId}`,
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

  createChat = async (chatName: string, chatLogo: string) => {
    try {
      // create it
      const data = await axios.post<ChatType>(
        `${this._serverUrl}/group`,
        {
          name: chatName,
          logo: chatLogo,
        },
        {
          headers: {
            Authorization: `Bearer ${this._token}`,
          },
        }
      );
      // now join it
      const joinData = await axios.post<InviteToChatType>(
        `${this._serverUrl}/chats`,
        {
          chatGroupId: data.data.id,
          isAccepted: true,
          isAdmin: true,
          isBanned: false,
        },
        {
          headers: {
            Authorization: `Bearer ${this._token}`,
          },
        }
      );
      toast.success("Chat created");
      return joinData;
    } catch (error) {
      const { request } = handleError(error);
      return request;
    }
  };

  getPendentInvites = async () => {
    try {
      const data = await axios.get<InviteToChatType[]>(
        `${this._serverUrl}/chats?FilterValue=${this._userId}&FilterBy=UserId&IsAccepted=false`,
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

  acceptInvite = async (invite: InviteToChatType) => {
    try {
      const data = await axios.put<InviteToChatType>(
        `${this._serverUrl}/chats`,
        {
          id: invite.id,
          isAccepted: true,
          isAdmin: false,
          isBanned: false,
        },
        {
          headers: {
            Authorization: `Bearer ${this._token}`,
          },
        }
      );
      toast.success(`Joined ${invite.chatGroup.name}`);
      return data;
    } catch (e: any) {
      const { request } = handleError(e);
      return request;
    }
  };

  refuseInvite = async (invite: InviteToChatType) => {
    try {
      const data = await axios.delete<InviteToChatType>(
        `${this._serverUrl}/chats/${invite.id}`,
        {
          headers: {
            Authorization: `Bearer ${this._token}`,
          },
        }
      );
      toast.success(`Refused ${invite.chatGroup.name}`);
      return data;
    } catch (e: any) {
      const { request } = handleError(e);
      return request;
    }
  };
}
