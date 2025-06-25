// api/postService.ts
import { useAuth } from '@/lib/auth-provider';
import axios from 'axios';
import { useState } from 'react';

const API_URL = 'http://localhost:8091/posts';

export const useCreatePost = () => {
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    const createPost = async (title: string, content: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post(API_URL, { title, content }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setData(response.data);
            return response.data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
            console.error('Failed to create post:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { createPost, isLoading, error, data };
};

export const useGetAllPosts = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any[]>([]);
    const { token } = useAuth();

    const fetchPosts = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(API_URL, {
                headers: token ? {
                    'Authorization': `Bearer ${token}`
                } : {}
            });
            setData(response.data);
            return response.data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(message);
            console.error('Failed to fetch posts:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return {
        fetchPosts,
        posts: data,
        isLoading,
        error
    };
};