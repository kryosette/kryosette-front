'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-provider';
import { toast } from 'sonner';

const API_URL = 'http://localhost:8088/api/v1';

interface FriendDto {
    id: string;
    username: string;
    avatarUrl?: string;
}

export function FriendsList() {
    const { token } = useAuth();
    const [friends, setFriends] = useState<FriendDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFriends = async () => {
            if (!token) return;

            try {
                const response = await axios.get(`${API_URL}/friends`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                setFriends(response.data);
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 401) {
                        toast.error('Authorization required');
                    } else {
                        toast.error(error.response?.data?.message || 'Failed to load friends');
                    }
                } else {
                    toast.error('Failed to load friends');
                    console.error('Error fetching friends:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, [token]);

    const handleRemoveFriend = async (friendId: string) => {
        if (!token) return;

        try {
            await axios.post(
                `${API_URL}/friends/remove/${friendId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            setFriends(prev => prev.filter(f => f.id !== friendId));
            toast.success('Friend removed successfully');
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Failed to remove friend');
            } else {
                toast.error('Failed to remove friend');
                console.error('Error removing friend:', error);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
        >
            <Card className="rounded-lg shadow-sm border border-gray-200/50 bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-200/50">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Friends</CardTitle>
                        <span className="text-sm text-gray-500">{friends.length}</span>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    {loading ? (
                        <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <Avatar className="h-20 w-20 mb-1 border border-gray-200 animate-pulse bg-gray-200" />
                                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-3 gap-2">
                                {friends.map((friend) => (
                                    <motion.div
                                        key={friend.id}
                                        whileHover={{ y: -3 }}
                                        className="flex flex-col items-center group relative"
                                    >
                                        <Avatar className="h-20 w-20 mb-1 border border-gray-200">
                                            <AvatarImage src={friend.avatarUrl || `/avatars/${friend.id}.jpg`} />
                                            <AvatarFallback>
                                                {friend.username[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <p className="text-xs text-center truncate w-full">
                                            {friend.username}
                                        </p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6 rounded-full bg-red-500 text-white hover:bg-red-600"
                                            onClick={() => handleRemoveFriend(friend.id)}
                                        >
                                            ✕
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                            <motion.div whileHover={{ scale: 1.01 }}>
                                <Button variant="ghost" className="w-full mt-3 text-indigo-600">
                                    See All Friends
                                </Button>
                            </motion.div>
                        </>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}