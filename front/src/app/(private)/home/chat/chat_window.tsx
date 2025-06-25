import { useEffect, useRef, useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useAuth } from '@/lib/auth-provider';

type Message = {
    id: number;
    content: string;
    sender: string;
    timestamp: string;
};

export function ChatWindow({ chatId }: { chatId: number }) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const stompClientRef = useRef<Client | null>(null);
    const { token } = useAuth(); // Предполагается, что у вас есть хук useAuth()

    // Загрузка начальных сообщений
    const { data: initialMessages } = useQuery<Message[]>({
        queryKey: ['messages', chatId],
        queryFn: () => axios.get(`/api/v1/messages/chat/${chatId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => res.data),
    });

    useEffect(() => {
        if (initialMessages) {
            setMessages(initialMessages);
        }
    }, [initialMessages]);

    useEffect(() => {
        // Инициализация STOMP клиента
        const socket = new SockJS('http://localhost:8088/api/v1/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: (str) => console.log(str)
        });

        stompClient.onConnect = () => {
            console.log('Connected to WebSocket');

            // Подписка на получение сообщений
            stompClient.subscribe(`/topic/messages/${chatId}`, (message) => {
                const newMessage: Message = JSON.parse(message.body);
                setMessages(prev => [...prev, newMessage]);
            });
        };

        stompClient.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };

        stompClient.activate();
        stompClientRef.current = stompClient;

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [chatId, token]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sendMessage = () => {
        if (!message.trim()) return;

        const newMessage = {
            content: message,
            sender: 'User',
            chatId: chatId,
            timestamp: new Date().toISOString()
        };

        if (stompClientRef.current && stompClientRef.current.connected) {
            stompClientRef.current.publish({
                destination: `/app/chat/${chatId}`,
                body: JSON.stringify(newMessage),
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMessage('');
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map(msg => (
                    <div key={msg.id} className="mb-4">
                        <div className="font-semibold">{msg.sender}</div>
                        <div className="text-gray-700">{msg.content}</div>
                        <div className="text-xs text-gray-500">
                            {new Date(msg.timestamp).toLocaleString()}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t flex gap-2">
                <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                />
                <Button onClick={sendMessage}>
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}