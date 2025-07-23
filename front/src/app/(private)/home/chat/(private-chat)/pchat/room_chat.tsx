'use client'

import { useAuth } from "@/lib/auth-provider";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal, SmilePlus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";
import { ru } from "date-fns/locale";
import Link from "next/link";
import { useTypingStatus } from "@/lib/hooks/use_typing_status";
import { toast } from "sonner";

interface PrivateMessage {
    id: number;
    emailId: string
    content: string;
    timestamp: string;
    sender: string;
    userId: string;
    privateRoomId: number;
}

const BACKEND_URL_CHAT = "http://localhost:8092";

export default function PrivateRoomChat({ roomId }: { roomId: string }) {
    // @ts-ignore
    const { token, user } = useAuth();
    const [messages, setMessages] = useState<PrivateMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { typingStatus, sendTypingStatus } = useTypingStatus(roomId, token);
    const [remainingRequests, setRemainingRequests] = useState(5);
    const [error, setError] = useState(null);

    const loadMessages = async () => {
        try {
            const response = await axios.get(
                `${BACKEND_URL_CHAT}/api/private-rooms/${roomId}/messages`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const adaptedMessages = response.data.map((msg: any) => ({
                id: msg.id,
                content: msg.content,
                timestamp: msg.timestamp || msg.createdAt,
                sender: msg.sender,
                userId: msg.userId,
                privateRoomId: msg.privateRoomId
            }));

            setMessages(adaptedMessages);
        } catch (error) {
            console.error("Error loading private messages:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        loadMessages();

        pollingIntervalRef.current = setInterval(loadMessages, 3000);

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [roomId, token]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const formatTypingStatus = () => {
        const activeTypers = typingStatus.filter(status =>
            status.isTyping && status.userId !== user?.id
        );

        if (activeTypers.length === 0) return null;

        const names = activeTypers.map(status => status.username);

        if (names.length === 1) {
            return `${names[0]} печатает...`;
        } else if (names.length === 2) {
            return `${names[0]} и ${names[1]} печатают...`;
        } else {
            return `${names.slice(0, -1).join(', ')} и ${names.slice(-1)[0]} печатают...`;
        }
    };

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewMessage(value);

        if (value.trim()) {
            await sendTypingStatus(true);

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            typingTimeoutRef.current = setTimeout(() => {
                sendTypingStatus(false);
            }, 2000);
        } else {
            await sendTypingStatus(false);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const response = await axios.post(
                `${BACKEND_URL_CHAT}/api/private-rooms/${roomId}/messages`,
                { content: newMessage },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const newMsg = {
                id: response.data.id,
                content: response.data.content,
                timestamp: response.data.timestamp,
                sender: user?.username || "Вы",
                userId: user?.id || "",
                privateRoomId: parseInt(roomId)
            };

            const remaining = response.headers['x-ratelimit-remaining']
            if (remaining) {
                setRemainingRequests(parseInt(remaining));
            }

            setMessages(prev => [...prev, newMsg]);
            setNewMessage("");

            await sendTypingStatus(false);
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            toast.success("Сообщение отправлено");
            setError(null);
        } catch (err) {
            if (err.response?.status === 429) {
                alert(`Превышен лимит запросов! Попробуйте через ${err.response?.data?.retryAfter || 60} секунд`);
            } else {
                alert(err.response?.data?.message || "Ошибка при отправке сообщения");
            }

            if (err.response?.headers['x-ratelimit-remaining']) {
                setRemainingRequests(parseInt(err.response.headers['x-ratelimit-remaining']));
            }
        }
    };

    const formatMessageTime = (dateString: string) => {
        try {
            if (!dateString) return 'только что';
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'только что';
            return formatDistanceToNow(date, { addSuffix: true, locale: ru });
        } catch {
            return 'только что';
        }
    };

    const groupMessagesByDay = () => {
        const grouped: { [key: string]: PrivateMessage[] } = {};

        messages.forEach((message) => {
            const date = message.timestamp || new Date().toISOString();
            let dayKey;

            if (isToday(new Date(date))) {
                dayKey = 'Сегодня';
            } else if (isYesterday(new Date(date))) {
                dayKey = 'Вчера';
            } else {
                dayKey = format(new Date(date), 'd MMMM yyyy', { locale: ru });
            }

            if (!grouped[dayKey]) {
                grouped[dayKey] = [];
            }
            grouped[dayKey].push(message);
        });

        return grouped;
    };

    const groupedMessages = groupMessagesByDay();

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-hidden">
                {formatTypingStatus() && (
                    <div className="flex items-center justify-center py-1 bg-muted/50">
                        <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-background">
                            <div className="flex space-x-1">
                                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {formatTypingStatus()}
                            </span>
                        </div>
                    </div>
                )}

                <ScrollArea ref={scrollAreaRef} className="h-full p-4">
                    {isLoading ? (
                        <div className="flex flex-col space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-1/3 bg-muted rounded animate-pulse"></div>
                                        <div className="h-8 bg-muted rounded animate-pulse"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <p>Нет сообщений</p>
                            <p className="text-sm">Начните первым!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {Object.entries(groupedMessages).map(([day, dayMessages]) => (
                                <div key={day} className="space-y-4">
                                    <div className="flex items-center justify-center my-4">
                                        <div className="px-3 py-1 text-xs text-muted-foreground bg-muted rounded-full">
                                            {day}
                                        </div>
                                    </div>
                                    {dayMessages.map((message) => (
                                        <div
                                            key={`message-${message.id}-${message.timestamp}`}
                                            className={`flex gap-3 ${message.userId === user?.id ? "justify-end" : "justify-start"}`}
                                        >
                                            {message.userId !== user?.id && (
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback>
                                                        {message.sender.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className={`max-w-[80%] flex flex-col ${message.userId === user?.id ? "items-end" : "items-start"}`}>
                                                <Link href={`/home/users/${message.sender}`}>
                                                    {message.userId !== user?.id && (
                                                        <span className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                                                            {message.sender}
                                                        </span>
                                                    )}
                                                </Link>
                                                <div
                                                    className={`p-3 rounded-lg ${message.userId === user?.id
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-muted"}`}
                                                >
                                                    <p>{message.content}</p>
                                                </div>

                                                <span className="text-xs text-muted-foreground mt-1">
                                                    {formatMessageTime(message.timestamp)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </ScrollArea>
            </div>

            <div className="p-4 border-t">
                <div className="flex gap-2 items-center">
                    <Button variant="ghost" size="icon">
                        <SmilePlus className="h-5 w-5" />
                    </Button>
                    <Input
                        value={newMessage}
                        onChange={handleInputChange}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Написать сообщение..."
                        className="flex-1"
                    />
                    <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        size="icon"
                    >
                        <SendHorizonal className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}