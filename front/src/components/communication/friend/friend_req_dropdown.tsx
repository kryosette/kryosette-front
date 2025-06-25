'use client'

import { formatDistanceToNow } from 'date-fns';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '../../ui/dropdown-menu';
import { Button } from '../../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../../ui/avatar';
import { useFriendRequests } from '@/hooks/use_friend_req';

export function FriendRequestsDropdown() {
    const { friendRequests, isLoading, acceptRequest, isAccepting } = useFriendRequests();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="relative">
                    Заявки в друзья
                    {friendRequests && friendRequests.length > 0 && (
                        <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs flex items-center justify-center text-white">
                            {friendRequests.length}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72">
                {isLoading && <DropdownMenuItem>Загрузка...</DropdownMenuItem>}
                {friendRequests?.length === 0 && (
                    <DropdownMenuItem>Нет новых заявок</DropdownMenuItem>
                )}
                {friendRequests?.map((request: any) => (
                    <DropdownMenuItem key={request.id} className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={`/avatars/${request.senderId}.jpg`} />
                            <AvatarFallback>{request.senderUsername[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="font-medium">{request.senderUsername}</p>
                            <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                        <Button
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                acceptRequest(request.id);
                            }}
                            disabled={isAccepting}
                        >
                            Принять
                        </Button>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}