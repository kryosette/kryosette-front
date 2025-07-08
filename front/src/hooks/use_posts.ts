// hooks/use_posts.ts
'use client'

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '@/lib/auth-provider';

const API_URL = 'http://localhost:8091/posts';

export const usePosts = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    const fetchPosts = async ({ pageParam = 0 }) => {
        const response = await axios.get(API_URL, {
            params: {
                page: pageParam,
                size: pageParam === 0 ? 10 : 5
            },
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    };

    const deletePostMutation = useMutation({
        mutationFn: async (postId: number) => {
            await axios.delete(`${API_URL}/${postId}/delete`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch,
    } = useInfiniteQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage.content || lastPage.content.length === 0 || lastPage.content.length < (allPages.length === 1 ? 10 : 5)) {
                return undefined;
            }
            return allPages.length;
        },
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });

    const posts = data?.pages.flatMap(page => page.content) || [];

    return {
        posts,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        error: isError ? (error instanceof Error ? error.message : 'Failed to load posts') : null,
        refetch,
        deletePost: deletePostMutation.mutate,
        isDeleting: deletePostMutation.isPending,
    };
};