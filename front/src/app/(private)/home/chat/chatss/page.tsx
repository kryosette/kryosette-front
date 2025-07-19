'use client'

import WebSocketManager from '@/components/ws/websocket_,manager';
import { useChatStore } from '@/lib/store';
import { RoomList } from '../chats/room_window';
import { ChatWindow } from '../chat_window';

export default function Home() {
    const { currentRoom } = useChatStore();


    return (
        <div className="flex h-screen bg-background">
            <WebSocketManager />
            <RoomList />
            {currentRoom ? <ChatWindow /> : (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-muted-foreground">Выберите комнату</p>
                </div>
            )}
        </div>
    );
}