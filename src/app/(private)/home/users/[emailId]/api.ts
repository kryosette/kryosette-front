import { useAuth } from '@/lib/auth-provider';
import axios from 'axios';

interface PrivateRoom {
    id: number;
    name: string;
    description: string | null;
    createdAt: string;
    createdBy: string;
    type: string;
    participantIds: string[];
}

export const getUserEmail = async (emailId: string, token: string): Promise<UserProfile> => {
    try {
        const response = await axios.get(`http://localhost:8088/api/v1/user/email/${emailId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        // Возвращаем данные, где email - это userId
        return {
            ...response.data,
            id: response.data.email, // Вот здесь берем email как id
            userId: response.data.email // И дублируем в userId
        };
    } catch (error) {
        console.error('Error fetching user:', error);
        throw new Error('Не удалось загрузить пользователя');
    }
}

export const subscribeToUser = async (emailId: string, token: string): Promise<void> => {
    try {
        await axios.post(`http://localhost:8088/api/v1/user/subscribe/email/${emailId}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error subscribing to user:', error);
        throw new Error('Не удалось подписаться на пользователя');
    }
};

export const unsubscribeFromUser = async (emailId: string, token: string): Promise<void> => {
    try {
        await axios.delete(`http://localhost:8088/api/v1/user/unsubscribe/email/${emailId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error unsubscribing from user:', error);
        throw new Error('Не удалось отписаться от пользователя');
    }
};

export const checkSubscription = async (emailId: string, token: string): Promise<boolean> => {
    try {
        const response = await axios.get(`http://localhost:8088/api/v1/user/is-subscribed/email/${emailId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error checking subscription:', error);
        throw new Error('Не удалось проверить статус подписки');
    }
};

export const getFollowersCount = async (emailId: string, token: string): Promise<number> => {
    try {
        const response = await axios.get(`http://localhost:8088/api/v1/user/followers-count/email/${emailId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error getting followers count:', error);
        throw new Error('Не удалось получить количество подписчиков');
    }
};

export const createPrivateRoom = async (
    token: string,
    participant1Id: string,
    participant2Id: string
): Promise<PrivateRoom> => {
    try {
        const response = await axios.post(
            'http://localhost:8092/api/rooms/private',
            {
                participant1Id,
                participant2Id
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating private room:', error);
        throw new Error('Не удалось создать приватный чат');
    }
};