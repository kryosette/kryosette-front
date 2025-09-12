import { useAuth } from '@/lib/auth-provider';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8088/api/v1',
    withCredentials: true,
});

// Interceptor для добавления токена
api.interceptors.request.use((config) => {
    const { token } = useAuth();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const sendFriendRequest = (receiverId: number) =>
    api.post<FriendRequestDTO>(`/friends/request/${receiverId}`);

export const acceptFriendRequest = (requestId: number) =>
    api.post<FriendRequestDTO>(`/friends/accept/${requestId}`);

export const rejectFriendRequest = (requestId: number) =>
    api.post(`/friends/reject/${requestId}`);

export const getPendingFriendRequests = () =>
    api.get<FriendRequestDTO[]>('/friends/requests/pending');

export interface FriendRequestDTO {
    id: number;
    senderId: number;
    senderUsername: string;
    receiverId: number;
    receiverUsername: string;
    status: string;
    createdAt: string;
}