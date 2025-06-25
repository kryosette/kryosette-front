'use client'

import { useAuth } from '@/lib/auth-provider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:8091';

export const useComments = (postId: number) => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    const {
        data: comments,
        isLoading: isCommentsLoading,
        error: commentsError,
        refetch: refetchComments
    } = useQuery({
        queryKey: ['posts', postId, 'comments'],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/posts/${postId}/comments`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return res.data;
        },
        enabled: !!postId && !!token,
        select: (data) => data.map(comment => ({
            ...comment,
            replies: comment.replies || [] // Добавляем пустой массив, если replies нет
        }))
    });

    const fetchReplies = async (commentId: number) => {
        const res = await axios.get(`/comments/${commentId}/replies`);
        return res.data;
    };

    // Мутация для создания комментария
    const { mutate: addComment, isPending: isAddingComment } = useMutation({
        mutationFn: async (content: string) => {
            const res = await axios.post(
                `${API_URL}/posts/${postId}/comments`,
                { content },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return res.data;
        },
        onMutate: async (newCommentContent) => {
            await queryClient.cancelQueries({
                queryKey: ['posts', postId, 'comments']
            });

            const previousComments = queryClient.getQueryData(['posts', postId, 'comments']);

            queryClient.setQueryData(
                ['posts', postId, 'comments'],
                (old: any[]) => [
                    {
                        id: Date.now(),
                        content: newCommentContent,
                        postId,
                        author: { username: 'You' },
                        createdAt: new Date().toISOString(),
                        isOptimistic: true,
                        repliesCount: 0,
                        replies: []
                    },
                    ...old
                ]
            );

            return { previousComments };
        },
        onError: (err, newCommentContent, context) => {
            queryClient.setQueryData(
                ['posts', postId, 'comments'],
                context?.previousComments
            );
        },
        onSuccess: (newComment, newCommentContent) => {
            queryClient.setQueryData(
                ['posts', postId, 'comments'],
                (old: any[]) => [
                    newComment,
                    ...old.filter(comment => !comment.isOptimistic)
                ]
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ['posts', postId, 'comments']
            });
        }
    });

    // Мутация для создания ответа
    const { mutate: addReply, isPending: isAddingReply } = useMutation({
        mutationFn: async ({ commentId, content }: { commentId: number, content: string }) => {
            const res = await axios.post(
                `${API_URL}/posts/${postId}/comments/${commentId}/replies`,
                { content },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return res.data;
        },
        onMutate: async ({ commentId, content }) => {
            await queryClient.cancelQueries({
                queryKey: ['posts', postId, 'comments']
            });

            const previousComments = queryClient.getQueryData(['posts', postId, 'comments']);

            queryClient.setQueryData(
                ['posts', postId, 'comments'],
                (old: any[]) => old.map(comment => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            repliesCount: comment.repliesCount + 1,
                            replies: [
                                ...(comment.replies || []),
                                {
                                    id: Date.now(),
                                    content,
                                    author: { username: 'You' },
                                    createdAt: new Date().toISOString(),
                                    isOptimistic: true
                                }
                            ]
                        };
                    }
                    return comment;
                })
            );

            return { previousComments };
        },
        onError: (err, variables, context) => {
            queryClient.setQueryData(
                ['posts', postId, 'comments'],
                context?.previousComments
            );
        },
        onSuccess: (newReply, variables) => {
            queryClient.setQueryData(
                ['posts', postId, 'comments'],
                (old: any[]) => old.map(comment => {
                    if (comment.id === variables.commentId) {
                        return {
                            ...comment,
                            replies: [
                                newReply,
                                ...(comment.replies?.filter((r: any) => !r.isOptimistic) || [])
                            ]
                        };
                    }
                    return comment;
                })
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ['posts', postId, 'comments']
            });
        }
    });

    return {
        comments: comments || [],
        isLoading: isCommentsLoading,
        error: commentsError,
        addComment,
        addReply: (commentId: number, content: string) => addReply({ commentId, content }),
        isAddingComment,
        isAddingReply,
        refetchComments
    };
};