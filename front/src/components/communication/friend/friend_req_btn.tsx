'use client'
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { sendFriendRequest } from './api';

interface FriendRequestButtonProps {
    receiverId: number;
}

export function FriendRequestButton({ receiverId }: FriendRequestButtonProps) {
    const queryClient = useQueryClient();

    const { mutate, isLoading } = useMutation({
        mutationFn: () => sendFriendRequest(receiverId),
        onSuccess: () => {
            toast({
                title: 'Friend request sent',
                description: 'Your friend request has been sent successfully',
            });
            queryClient.invalidateQueries(['users']);
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'Failed to send friend request',
                variant: 'destructive',
            });
        },
    });

    return (
        <Button
            onClick={() => mutate()}
            disabled={isLoading}
        >
            {isLoading ? 'Sending...' : 'Add Friend'}
        </Button>
    );
}