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
            const commentsRes = await axios.get(`${API_URL}/posts/${postId}/comments`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            const commentsWithReplies = await Promise.all(
                commentsRes.data.map(async (comment: any, commentId: number) => {
                    if (comment.repliesCount > 0) {
                        try {
                            const repliesRes = await axios.get(
                                `${API_URL}/comments/${commentId}/replies`,
                                { headers: { Authorization: `Bearer ${token}` } }
                            )
                            return { ...comment, replies: repliesRes.data }
                        } catch (error) {
                            console.error(`Ошибка загрузки ответов для комментария ${commentId}:`, error)
                            return { ...comment, replies: [] }
                        }
                    }
                    return { ...comment, replies: [] }
                })
            )

            return commentsWithReplies
        },
        enabled: !!postId && !!token,
        select: (data) => data.map(comment => ({
            ...comment,
            replies: comment.replies || [], // Initialize replies array
            repliesCount: comment.repliesCount || 0,
        }))
    });


    const fetchReplies = async (commentId: number) => {
        try {
            const res = await axios.get(`${API_URL}/comments/${commentId}/replies`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return res.data;
        } catch (error) {
            console.error("Error fetching replies:", error);
            throw error;
        }
    };

    const loadReplies = async (commentId: number) => {
        try {
            const replies = await fetchReplies(commentId);
            queryClient.setQueryData(
                ['posts', postId, 'comments'],
                (old: any[]) => old.map(comment => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            replies,
                            showReplies: true
                        };
                    }
                    return comment;
                })
            );
        } catch (error) {
            console.error("Ошибка загрузки ответов:", error);
        }
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
                `${API_URL}/comments/${commentId}/replies`,
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
        refetchComments,
        loadReplies
    };
};