'use client';

import { Button } from '@/components/ui/button';
import { useFriendRequests } from '@/lib/hooks/use_friend_req';

interface FriendRequestButtonProps {
    receiverId: number;
}

export function FriendRequestButton({ receiverId }: FriendRequestButtonProps) {
    const { sendRequest, isSending, outgoingRequests } = useFriendRequests();

    // Проверяем, есть ли уже исходящая заявка к этому пользователю
    const hasOutgoingRequest = outgoingRequests.some(
        request => request.receiverId === receiverId
    );

    const handleClick = () => {
        if (hasOutgoingRequest) {
            return;
        }
        sendRequest(receiverId);
    };

    return (
        <Button
            onClick={handleClick}
            disabled={isSending || hasOutgoingRequest}
            variant={hasOutgoingRequest ? 'outline' : 'default'}
        >
            {isSending ? 'Отправка...' :
                hasOutgoingRequest ? 'Заявка отправлена' : 'Добавить в друзья'}
        </Button>
    );
}