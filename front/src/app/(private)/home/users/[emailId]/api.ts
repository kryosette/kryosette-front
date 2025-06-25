import { useAuth } from '@/lib/auth-provider';
import axios from 'axios';

export const getUserEmail = async (emailId: string, token: string): Promise<UserProfile> => { // UserProfile
    try {
        const response = await axios.get(`http://localhost:8088/api/v1/user/email/${emailId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data; // Return the entire user object
    } catch (error) {
        console.error('Error fetching user:', error);
        throw new Error('Не удалось загрузить пользователя');
    }
}