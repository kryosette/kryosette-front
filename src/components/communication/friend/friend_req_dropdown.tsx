'use client';

import { formatDistanceToNow } from 'date-fns';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '../../ui/dropdown-menu';
import { Button } from '../../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../../ui/avatar';
import { useAuth } from '@/lib/auth-provider';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const API_URL = 'http://localhost:8088/api/v1';

interface FriendRequest {
    id: string;
    senderId: string;
    senderUsername: string;
    receiverId: string;
    receiverUsername: string;
    status: string;
    createdAt: string;
}

export function FriendRequestsDropdown() {
    const { token, user } = useAuth();
    const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        // if (!token || !user?.id) return;

        const fetchPendingRequests = async () => {
            try {
                const response = await axios.get(`${API_URL}/friends/requests/pending`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPendingRequests(response.data);
            } catch (error) {
                console.error('Error fetching pending requests:', error);
                toast.error('Failed to load friend requests');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPendingRequests();
    }, [token, user?.id]);

    const acceptRequest = async (requestId: string) => {
        // if (!token || isProcessing) return;

        setIsProcessing(true);
        try {
            await axios.post(
                `${API_URL}/friends/accept/${requestId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Friend request accepted');
            setPendingRequests(prev => prev.filter(req => req.id !== requestId));
        } catch (error) {
            console.error('Error accepting request:', error);
            toast.error('Failed to accept friend request');
        } finally {
            setIsProcessing(false);
        }
    };

    const rejectRequest = async (requestId: string) => {
        // if (!token || isProcessing) return;

        setIsProcessing(true);
        try {
            await axios.post(
                `${API_URL}/friends/reject/${requestId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Friend request rejected');
            setPendingRequests(prev => prev.filter(req => req.id !== requestId));
        } catch (error) {
            console.error('Error rejecting request:', error);
            toast.error('Failed to reject friend request');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="relative border-black hover:bg-indigo-50">
                    Friend Requests
                    {pendingRequests.length > 0 && (
                        <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs flex items-center justify-center text-white">
                            {pendingRequests.length}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72">
                {isLoading && <DropdownMenuItem>Loading...</DropdownMenuItem>}
                {!isLoading && pendingRequests.length === 0 && (
                    <DropdownMenuItem>No new requests</DropdownMenuItem>
                )}
                {pendingRequests.map((request) => (
                    <DropdownMenuItem
                        key={request.id}
                        className="flex items-center gap-3"
                        onSelect={(e) => e.preventDefault()}
                    >
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
                        <div className="flex gap-1">
                            <Button
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    acceptRequest(request.id);
                                }}
                                disabled={isProcessing}
                            >
                                Accept
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    rejectRequest(request.id);
                                }}
                                disabled={isProcessing}
                            >
                                Reject
                            </Button>
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}