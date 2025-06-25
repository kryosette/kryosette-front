'use client'

import { useAuth } from '@/lib/auth-provider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const BACKEND_URL = "http://localhost:8088";

export function useFriendRequests() {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    const { data: friendRequests, isLoading, error } = useQuery({
        queryKey: ['friendRequests'],
        queryFn: async () => {
            const response = await fetch(`${BACKEND_URL}/api/v1/friends/requests/pending`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        },
        enabled: !!token,
    });

    const acceptRequestMutation = useMutation({
        mutationFn: async (requestId: string) => {
            const response = await fetch(`${BACKEND_URL}/api/v1/friends/accept/${requestId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to accept friend request');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
        },
    });

    return {
        friendRequests,
        isLoading,
        error,
        acceptRequest: acceptRequestMutation.mutate,
        isAccepting: acceptRequestMutation.isPending,
    };
}