import { useAuth } from "@/lib/auth-provider";
import { httpClient } from "./config/AxiosHelper";

export const createRoomApi = async (roomDetail, token) => {
  const respone = await httpClient.post(`/api/v1/rooms`, roomDetail, {
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${token}`
    },
  });
  return respone.data;
};

export const joinChatApi = async (roomId, token) => {
  const response = await httpClient.get(`/api/v1/rooms/${roomId}`, {
    // headers: {
    //   Authorization: `Bearer ${token}`
    // }
  });
  return response.data;
};

export const getMessagess = async (roomId, size = 50, page = 0, token) => {
  const response = await httpClient.get(
    `/api/v1/rooms/${roomId}/messages?size=${size}&page=${page}`, {
    // headers: {
    //   Authorization: `Bearer ${token}`
    // }
  }
  );
  return response.data;
};
