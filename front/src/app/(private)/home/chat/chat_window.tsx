'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useChatStore } from '@/lib/store';
import { useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-provider';
import axios from 'axios';

export function ChatWindow() {
    const { currentRoom, messages, addMessage } = useChatStore();
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { token } = useAuth();

    const handleSendMessage = async () => {
        if (!inputRef.current?.value.trim() || !currentRoom) return;

        try {
            const messageData = {
                content: inputRef.current.value,
                sender: "currentUser", // должно быть реальное имя пользователя
                roomId: currentRoom.id, // важно передать ID комнаты
                userId: "currentUserId" // ID пользователя из авторизации
            };

            // Отправка через API
            await axios.post(`http://localhost:8092/api/rooms/${currentRoom.id}/messages`, messageData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            inputRef.current.value = '';
        } catch (error) {
            console.error('Ошибка отправки:', error);
        }
    };

    // Автоскролл к новым сообщениям
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b">
                <h2 className="text-xl font-bold">{currentRoom?.name}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className="flex gap-3">
                        <div className="bg-accent p-3 rounded-lg max-w-[80%]">
                            <p className="font-semibold">{msg.sender}</p>
                            <p>{msg.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {msg.timestamp.toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t">
                <div className="flex gap-2">
                    <Input
                        ref={inputRef}
                        placeholder="Напишите сообщение..."
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}