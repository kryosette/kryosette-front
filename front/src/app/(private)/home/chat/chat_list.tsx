import { useState } from 'react';
import { PlusCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '@/lib/auth-provider';

type Chat = {
    id: number;
    name: string;
    createdAt: string;
};

export function ChatList() {
    const [newChatName, setNewChatName] = useState('');
    const queryClient = useQueryClient();
    const { token } = useAuth();

    const { data: chats } = useQuery<Chat[]>({
        queryKey: ['chats'],
        queryFn: () => axios.get('http://localhost:8088/api/v1/chats', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => res.data),
    });

    const createChat = useMutation({
        mutationFn: (name: string) => axios.post('http://localhost:8088/api/v1/chats', { name }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chats'] });
            setNewChatName('');
        },
    });

    return (
        <div className="w-64 border-r h-full p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Chats</h2>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => createChat.mutate(newChatName)}
                    disabled={!newChatName}
                >
                    <PlusCircle className="h-5 w-5" />
                </Button>
            </div>

            <Input
                placeholder="New chat name"
                value={newChatName}
                onChange={(e) => setNewChatName(e.target.value)}
                className="mb-4"
            />

            <div className="flex-1 overflow-y-auto">
                {chats?.map(chat => (
                    <a
                        key={chat.id}
                        href={`/chat/${chat.id}`}
                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
                    >
                        <MessageSquare className="h-4 w-4" />
                        <span>{chat.name}</span>
                    </a>
                ))}
            </div>
        </div>
    );
}