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

interface Message {
    id: number;
    content: string;
    createdAt: string;
    sender: string;
    userId: string;
}

const BACKEND_URL_CHAT = "http://localhost:8092";

/**
 * RoomChat Component
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.roomId - The ID of the chat room
 * 
 * @description
 * A complete chat interface for a specific room that includes:
 * - Real-time message display
 * - Message grouping by date
 * - Typing indicators
 * - Message input with send functionality
 * - User authentication
 * - Message history loading
 * 
 * @state {Message[]} messages - List of messages in the room
 * @state {string} newMessage - Current message being composed
 * @state {boolean} isLoading - Loading state for messages
 * @state {boolean} isTyping - Local typing indicator state
 */
export default function RoomChat({ roomId }: { roomId: string }) {
    // @ts-ignore
    const { token, user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { typingStatus, sendTypingStatus } = useTypingStatus(roomId, token);
    const [remainingRequests, setRemainingRequests] = useState(5);
    const [error, setError] = useState(null);

    /**
     * Loads messages for the current room
     * @async
     */
    const loadMessages = async () => {
        try {
            const response = await axios.get(
                `${BACKEND_URL_CHAT}/api/rooms/${roomId}/messages`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const adaptedMessages = response.data.map((msg: any) => ({
                id: msg.id,
                content: msg.content || msg.text,
                createdAt: msg.createdAt || msg.timestamp,
                sender: msg.sender || msg.user?.username,
                userId: msg.userId || msg.user?.id
            }));

            setMessages(adaptedMessages);
        } catch (error) {
            console.error("Error loading messages:", error);
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

    /**
     * Formats typing status message
     * @returns {string|null} Formatted typing status or null if no one is typing
     */
    const formatTypingStatus = () => {
        const activeTypers = typingStatus.filter(status =>
            status.isTyping && status.userId !== user?.id
        );

        if (activeTypers.length === 0) return null;

        const names = activeTypers.map(status => status.username);

        if (names.length === 1) {
            return `${names[0]} is typing...`;
        } else if (names.length === 2) {
            return `${names[0]} and ${names[1]} are typing...`;
        } else {
            return `${names.slice(0, -1).join(', ')} and ${names.slice(-1)[0]} are typing...`;
        }
    };

    /**
     * Handles input changes and manages typing status
     * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
     */
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

    /**
     * Sends a new message to the chat
     * @async
     */
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const response = await axios.post(
                `${BACKEND_URL_CHAT}/api/rooms/${roomId}/messages`,
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
                createdAt: response.data.createdAt,
                sender: user?.username || "You",
                userId: user?.id || ""
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
            toast.success("Message sent successfully");
            setError(null);
        } catch (err) {
            if (err.response?.status === 429) {
                alert(`Превышен лимит запросов! Попробуйте через ${err.response?.data?.retryAfter || 60} секунд`);
            } else {
                alert(err.response?.data?.message || "Ошибка при отправке сообщения");
            }

            // Обновляем счетчик даже при ошибке
            const remaining = err.response?.headers['x-ratelimit-remaining'];
            if (remaining) {
                setRemainingRequests(parseInt(remaining));
            }
        }
    };

    /**
     * Formats message timestamp
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted relative time
     */
    const formatMessageTime = (dateString: string) => {
        try {
            if (!dateString) return 'just now';
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'just now';
            return formatDistanceToNow(date, { addSuffix: true, locale: ru });
        } catch {
            return 'just now';
        }
    };

    /**
     * Groups messages by date
     * @returns {Object} Messages grouped by date
     */
    const groupMessagesByDay = () => {
        const grouped: { [key: string]: Message[] } = {};

        messages.forEach((message) => {
            const date = message.createdAt || new Date().toISOString();
            let dayKey;

            if (isToday(new Date(date))) {
                dayKey = 'Today';
            } else if (isYesterday(new Date(date))) {
                dayKey = 'Yesterday';
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
                            <p>No messages yet</p>
                            <p className="text-sm">Be the first to start the conversation!</p>
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
                                            key={`message-${message.id}-${message.createdAt}`}
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
                                                        <span className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">{message.sender}</span>
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
                                                    {formatMessageTime(message.createdAt)}
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

            {/* Message input */}
            <div className="p-4 border-t">
                <div className="flex gap-2 items-center">
                    <Button variant="ghost" size="icon">
                        <SmilePlus className="h-5 w-5" />
                    </Button>
                    <Input
                        value={newMessage}
                        onChange={handleInputChange}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Type a message..."
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

// 'use client'

// import { useAuth } from "@/lib/auth-provider";
// import { useEffect, useState, useRef, useCallback } from "react";
// import axios from "axios";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { SendHorizonal, SmilePlus } from "lucide-react";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { formatDistanceToNow } from "date-fns";
// import { toast } from "@/components/ui/sonner";
// import SockJS from "sockjs-client";
// import { Client } from "@stomp/stompjs";

// interface Message {
//     id: number;
//     content: string;
//     createdAt: string;
//     sender: string;
//     userId: string;
// }

// export default function RoomChat({ roomId }: { roomId: string }) {
//     const { token, user } = useAuth();
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [newMessage, setNewMessage] = useState("");
//     const [isLoading, setIsLoading] = useState(true);
//     const messagesEndRef = useRef<HTMLDivElement>(null);
//     const stompClientRef = useRef<Client | null>(null);

//     // Форматирование времени сообщения
//     const formatMessageTime = useCallback((dateString: string) => {
//         try {
//             if (!dateString) return 'только что';
//             const date = new Date(dateString);
//             if (isNaN(date.getTime())) return 'только что';
//             return formatDistanceToNow(date, { addSuffix: true });
//         } catch {
//             return 'только что';
//         }
//     }, []);

//     // Загрузка начальных сообщений
//     const loadMessages = useCallback(async () => {
//         try {
//             const response = await axios.get(
//                 `http://localhost:8092/api/rooms/${roomId}/messages`,
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             const adaptedMessages = response.data.map((msg: any) => ({
//                 id: msg.id,
//                 content: msg.content || msg.text,
//                 createdAt: msg.createdAt || msg.timestamp,
//                 sender: msg.sender || msg.user?.username,
//                 userId: msg.userId || msg.user?.id
//             }));

//             setMessages(adaptedMessages);
//         } catch (error) {
//             toast.error("Не удалось загрузить сообщения");
//         } finally {
//             setIsLoading(false);
//         }
//     }, [roomId, token]);

//     // Подключение WebSocket
//     const setupWebSocket = useCallback(() => {
//         const socket = new SockJS('http://localhost:8092/ws');
//         const client = new Client({
//             webSocketFactory: () => socket,
//             connectHeaders: { Authorization: `Bearer ${token}` },
//             reconnectDelay: 5000,
//             heartbeatIncoming: 4000,
//             heartbeatOutgoing: 4000,
//             debug: (str) => console.log(str),
//         });

//         client.onConnect = () => {
//             client.subscribe(`/topic/room.${roomId}`, (message) => {
//                 const newMsg = JSON.parse(message.body);
//                 setMessages(prev => [...prev, {
//                     id: newMsg.id,
//                     content: newMsg.content,
//                     createdAt: newMsg.createdAt,
//                     sender: newMsg.sender,
//                     userId: newMsg.userId
//                 }]);
//             });
//         };

//         client.onStompError = (frame) => {
//             toast.error("Ошибка подключения к чату");
//             console.error("STOMP error:", frame.headers.message);
//         };

//         client.activate();
//         stompClientRef.current = client;

//         return () => {
//             if (client.connected) {
//                 client.deactivate();
//             }
//         };
//     }, [roomId, token]);

//     // Инициализация чата
//     useEffect(() => {
//         loadMessages();
//         return setupWebSocket();
//     }, [loadMessages, setupWebSocket]);

//     // Автоскролл при новых сообщениях
//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     // Отправка сообщения
//     const handleSendMessage = async () => {
//         if (!newMessage.trim()) return;

//         try {
//             await axios.post(
//                 `http://localhost:8092/api/rooms/${roomId}/messages`,
//                 { content: newMessage },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
//             setNewMessage("");
//         } catch (error) {
//             toast.error("Не удалось отправить сообщение");
//         }
//     };

//     return (
//         <div className="flex flex-col h-full">
//             <ScrollArea className="flex-1 p-4">
//                 {isLoading ? (
//                     <div className="flex flex-col space-y-4">
//                         {[...Array(5)].map((_, i) => (
//                             <div key={`skeleton-${i}`} className="flex gap-3">
//                                 <div className="flex-1 space-y-2">
//                                     <div className="h-4 w-1/3 bg-muted rounded animate-pulse"></div>
//                                     <div className="h-8 bg-muted rounded animate-pulse"></div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 ) : messages.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
//                         <p>Нет сообщений</p>
//                         <p className="text-sm">Начните общение первым!</p>
//                     </div>
//                 ) : (
//                     <div className="space-y-4">
//                         {messages.map((message) => (
//                             <div
//                                 key={`msg-${message.id}-${message.createdAt}`}
//                                 className={`flex gap-3 ${message.userId === user?.id ? "justify-end" : "justify-start"}`}
//                             >
//                                 {message.userId !== user?.id && (
//                                     <Avatar className="h-8 w-8">
//                                         <AvatarFallback>
//                                             {message.sender.charAt(0).toUpperCase()}
//                                         </AvatarFallback>
//                                     </Avatar>
//                                 )}
//                                 <div className={`max-w-[80%] flex flex-col ${message.userId === user?.id ? "items-end" : "items-start"}`}>
//                                     {message.userId !== user?.id && (
//                                         <span className="text-sm font-medium">{message.sender}</span>
//                                     )}
//                                     <div className={`p-3 rounded-lg ${message.userId === user?.id ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
//                                         <p>{message.content}</p>
//                                     </div>
//                                     <span className="text-xs text-muted-foreground mt-1">
//                                         {formatMessageTime(message.createdAt)}
//                                     </span>
//                                 </div>
//                             </div>
//                         ))}
//                         <div ref={messagesEndRef} />
//                     </div>
//                 )}
//             </ScrollArea>

//             <div className="p-4 border-t">
//                 <div className="flex gap-2 items-center">
//                     <Button variant="ghost" size="icon">
//                         <SmilePlus className="h-5 w-5" />
//                     </Button>
//                     <Input
//                         value={newMessage}
//                         onChange={(e) => setNewMessage(e.target.value)}
//                         onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//                         placeholder="Напишите сообщение..."
//                         className="flex-1"
//                     />
//                     <Button
//                         onClick={handleSendMessage}
//                         disabled={!newMessage.trim()}
//                         size="icon"
//                     >
//                         <SendHorizonal className="h-5 w-5" />
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     );
// }