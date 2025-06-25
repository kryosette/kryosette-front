import { useAuth } from '@/lib/auth-provider';
import axios from 'axios';
import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:8088/';

interface UserDto {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
}

export const getUsernames = async (): Promise<string[]> => {
    const [usernames, setUsernames] = useState<string[]>([]);
    const [user, setUser] = useState<UserDto | null>(null);
    const [loading, setLoading] = useState(true);
    const { token, logout } = useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/api/v1/user/username`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const UserDto = await response.json();
                    setUser(UserDto);
                } else {
                    console.error('Failed to fetch profile:', response.status);
                }

                const names = await getUsernames();
                setUsernames(names);
            } catch (error) {
                console.error('There was an error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchProfile();
        }


    }, [token]);
    const response = await axios.get(`${API_URL}/usernames`);
    return response.data;
};

export const getAllUsers = async (): Promise<any[]> => {
    const response = await axios.get(API_URL);
    return response.data;
};