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
import {
    MoreVertical,
    Pin as PinIcon,
    Trash2,
    Ban as BanIcon,
    PinOff as UnpinIcon
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageReactions } from "./message_reactions";

interface PrivateMessage {
    id: number;
    content: string;
    timestamp: string;
    sender: string;
    userId: string;
    privateRoomId: number;
    reactions: string;
    isPinned?: boolean;
}

const BACKEND_URL_CHAT = "http://localhost:8092";

export default function PrivateRoomChat({ roomId }: { roomId: string }) {
    // @ts-ignore
    const { token, user } = useAuth();
    const [messages, setMessages] = useState<PrivateMessage[]>([]);
    const [pinnedMessage, setPinnedMessage] = useState<PrivateMessage | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { typingStatus, sendTypingStatus } = useTypingStatus(roomId, token);
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const scrollPositionRef = useRef(0);

    const handleScroll = () => {
        if (!scrollAreaRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
        const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

        // Сохраняем текущую позицию скролла
        scrollPositionRef.current = scrollTop;

        // Если пользователь близко к низу (менее 100px), включаем автоскролл
        setAutoScrollEnabled(distanceFromBottom < 100);

        // Показываем кнопку "Вниз", если пользователь не внизу
        setShowScrollButton(distanceFromBottom > 100);
    };

    const loadMessages = async () => {
        try {
            const response = await axios.get(
                `${BACKEND_URL_CHAT}/api/private-rooms/${roomId}/messages`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const adaptedMessages = response.data.map((msg: any) => ({
                id: msg.id,
                content: msg.content,
                timestamp: msg.timestamp || msg.createdAt,
                sender: msg.sender,
                userId: msg.userId,
                privateRoomId: msg.privateRoomId,
                reactions: msg.reactions || {},
                isPinned: msg.isPinned
            }));

            // Находим закрепленное сообщение
            const pinned = adaptedMessages.find(msg => msg.isPinned);
            setPinnedMessage(pinned || null);

            // Фильтруем сообщения (удаленные и закрепленные)
            setMessages(adaptedMessages.filter(msg => !msg.isDeleted && !msg.isPinned));
        } catch (error) {
            console.error("Error loading messages:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        loadMessages();
        const interval = setInterval(loadMessages, 3000);
        return () => clearInterval(interval);
    }, [roomId, token]);

    useEffect(() => {
        if (!autoScrollEnabled) return;

        const scrollContainer = scrollAreaRef.current;
        if (!scrollContainer) return;

        // Используем RAF для плавной прокрутки
        const frameId = requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end"
            });
        });

        return () => cancelAnimationFrame(frameId);
    }, [messages, pinnedMessage, autoScrollEnabled]);

    useEffect(() => {
        const scrollContainer = scrollAreaRef.current;
        if (!scrollContainer || autoScrollEnabled) return;

        // Восстанавливаем позицию скролла после обновления
        scrollContainer.scrollTop = scrollPositionRef.current;
    }, [messages, pinnedMessage, autoScrollEnabled]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user) return;

        try {
            const response = await axios.post(
                `${BACKEND_URL_CHAT}/api/private-rooms/${roomId}/messages`,
                { content: newMessage },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessages(prev => [...prev, {
                id: response.data.id,
                content: response.data.content,
                timestamp: response.data.timestamp,
                sender: user.username,
                userId: user.id,
                privateRoomId: parseInt(roomId),
                reactions: "[]"
            }]);
            setNewMessage("");
            toast.success("Сообщение отправлено");
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Ошибка при отправке сообщения");
        }
    };

    const handleAddReaction = async (messageId: number, reaction: string) => {
        try {
            await axios.post(
                `${BACKEND_URL_CHAT}/api/private-rooms/${roomId}/messages/${messageId}/reactions`,
                { reaction },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            console.error("Error adding reaction:", error);
            toast.error("Не удалось добавить реакцию");
        }
    };

    const handleDeleteMessage = async (messageId: number) => {
        try {
            await axios.delete(
                `${BACKEND_URL_CHAT}/api/private-rooms/${roomId}/messages/${messageId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            loadMessages();
            toast.success("Сообщение удалено");
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    const handlePinMessage = async (messageId: number, pin: boolean) => {
        try {
            await axios.post(
                `${BACKEND_URL_CHAT}/api/private-rooms/${roomId}/messages/pin`,
                { messageId, pin },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            loadMessages();
            toast.success(pin ? "Сообщение закреплено" : "Сообщение откреплено");
        } catch (error) {
            console.error("Error pinning message:", error);
        }
    };

    const handleBlockUser = async (userId: string) => {
        try {
            await axios.post(
                `${BACKEND_URL_CHAT}/api/private-rooms/${roomId}/block/${userId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            loadMessages();
            toast.success("Пользователь заблокирован");
        } catch (error) {
            console.error("Error blocking user:", error);
        }
    };

    const formatTypingStatus = () => {
        const activeTypers = typingStatus.filter(status =>
            status.isTyping && status.userId !== user?.id
        );

        if (activeTypers.length === 0) return null;

        const names = activeTypers.map(status => status.username);
        if (names.length === 1) return `${names[0]} печатает...`;
        if (names.length === 2) return `${names[0]} и ${names[1]} печатают...`;
        return `${names.slice(0, -1).join(', ')} и ${names.slice(-1)[0]} печатают...`;
    };

    const formatMessageTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return formatDistanceToNow(date, { addSuffix: true, locale: ru });
        } catch {
            return 'только что';
        }
    };

    const groupMessagesByDay = () => {
        const grouped: Record<string, PrivateMessage[]> = {};
        messages.forEach(message => {
            const date = new Date(message.timestamp);
            let dayKey = isToday(date) ? 'Сегодня' :
                isYesterday(date) ? 'Вчера' :
                    format(date, 'd MMMM yyyy', { locale: ru });

            if (!grouped[dayKey]) grouped[dayKey] = [];
            grouped[dayKey].push(message);
        });
        return grouped;
    };

    const groupedMessages = groupMessagesByDay();

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-hidden">
                {/* Закрепленное сообщение */}
                {pinnedMessage && (
                    <div className="p-4 border-b bg-yellow-50 dark:bg-yellow-900/20">
                        <div className="flex items-center gap-2 mb-2">
                            <PinIcon className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                                Закрепленное сообщение
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                    {pinnedMessage.sender.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{pinnedMessage.sender}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatMessageTime(pinnedMessage.timestamp)}
                                    </span>
                                </div>
                                <p className="mt-1">{pinnedMessage.content}</p>
                            </div>
                            {user?.id === pinnedMessage.userId && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handlePinMessage(pinnedMessage.id, false)}
                                >
                                    <UnpinIcon className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {/* Индикатор печати */}
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

                {/* Основной чат */}
                <ScrollArea ref={scrollAreaRef} onWheel={(e) => {
                    if (e.deltaY < 0) {
                        setAutoScrollEnabled(false);
                    }
                }} onScroll={handleScroll} className="h-full p-4">
                    {isLoading ? (
                        <div className="flex flex-col space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
                                        <div className="h-8 bg-muted rounded animate-pulse" />
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
                                    {dayMessages.map(message => (
                                        <div
                                            key={`message-${message.id}-${message.timestamp}`}
                                            className={`flex gap-3 ${message.userId === user?.id ? "justify-end" : "justify-start"}`}
                                        >
                                            {message.userId !== user?.id && (
                                                <div className="flex flex-col items-center gap-1">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback>
                                                            {message.sender.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                                                <MoreVertical className="h-3 w-3" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuItem onClick={() => handleBlockUser(message.userId)}>
                                                                <BanIcon className="mr-2 h-4 w-4" />
                                                                Заблокировать
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            )}
                                            <div className={`max-w-[80%] flex flex-col ${message.userId === user?.id ? "items-end" : "items-start"}`}>
                                                <Link href={`/home/users/${message.sender}`}>
                                                    {message.userId !== user?.id && (
                                                        <span className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                                                            {message.sender}
                                                        </span>
                                                    )}
                                                </Link>
                                                <div className="group relative">
                                                    <div
                                                        className={`p-3 rounded-lg ${message.userId === user?.id
                                                            ? "bg-primary text-primary-foreground"
                                                            : "bg-muted"}`}
                                                    >
                                                        <p>{message.content}</p>
                                                    </div>

                                                    <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                        {message.userId === user?.id && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6"
                                                                onClick={() => handleDeleteMessage(message.id)}
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6"
                                                            onClick={() => handlePinMessage(message.id, true)}
                                                        >
                                                            <PinIcon className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <MessageReactions
                                                    messageId={message.id}
                                                    roomId={roomId}
                                                    token={token}
                                                    onAddReaction={handleAddReaction}
                                                    sender={message.sender.charAt(0).toUpperCase()}
                                                />

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

            {/* Поле ввода сообщения */}
            <div className="p-4 border-t">
                <div className="flex gap-2 items-center">
                    <Button variant="ghost" size="icon">
                        <SmilePlus className="h-5 w-5" />
                    </Button>
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
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