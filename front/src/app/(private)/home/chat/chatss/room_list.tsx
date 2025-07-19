'use client'

import { useAuth } from "@/lib/auth-provider";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal, SmilePlus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/components/ui/sonner";
import Link from "next/link";

interface Message {
    id: number;
    content: string;
    createdAt: string;
    sender: string;
    userId: string;
}

export default function RoomChat({ roomId }: { roomId: string }) {
    const { token, user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pollingIntervalRef = useRef<NodeJS.Timeout>();


    // Загрузка сообщений
    useEffect(() => {
        const loadMessages = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8092/api/rooms/${roomId}/messages`,
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
                toast.error("Не удалось загрузить сообщения");
            } finally {
                setIsLoading(false);
            }
        };

        // Первая загрузка
        setIsLoading(true);
        loadMessages();

        // Настраиваем Polling (обновление каждые 3 секунды)
        pollingIntervalRef.current = setInterval(loadMessages, 3000);

        // Очистка интервала при размонтировании
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [roomId, token]);

    // Автоскролл при новых сообщениях
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Отправка сообщения
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const response = await axios.post(
                `http://localhost:8092/api/rooms/${roomId}/messages`,
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
                sender: user?.username || "Вы",
                userId: user?.id || ""
            };

            setMessages(prev => [...prev, newMsg]);
            setNewMessage("");
        } catch (error) {
            toast.error("Не удалось отправить сообщение");
        }
    };

    const formatMessageTime = (dateString: string) => {
        try {
            if (!dateString) return 'только что';
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'только что';
            return formatDistanceToNow(date, { addSuffix: true });
        } catch {
            return 'только что';
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Область сообщений с фиксированной высотой */}
            <div className="flex-1 overflow-hidden">
                <ScrollArea
                    ref={scrollAreaRef}
                    className="h-full p-4"
                >
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
                            <p className="text-sm">Начните общение первым!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((message) => (
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
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </ScrollArea>
            </div>

            {/* Поле ввода */}
            <div className="p-4 border-t">
                <div className="flex gap-2 items-center">
                    <Button variant="ghost" size="icon">
                        <SmilePlus className="h-5 w-5" />
                    </Button>
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Напишите сообщение..."
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