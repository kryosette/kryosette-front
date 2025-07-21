'use client';

import { useChatStore } from '@/lib/store';
import { RoomList } from './room_window';
import WebSocketManager from '@/lib/ws/websocket_,manager';

/**
 * Home Component
 * 
 * @component
 * @description
 * The main chat interface component that renders:
 * - WebSocket connection manager
 * - Room list sidebar
 * - Active chat window or placeholder when no room is selected
 * 
 * @example
 * <Home />
 * 
 * @hooks
 * - useChatStore: Accesses the current room state from global store
 * 
 * @requires
 * - WebSocketManager: Handles WebSocket connections
 * - RoomList: Displays available chat rooms
 * - ChatWindow: Displays messages for the selected room
 */
export default function Home() {
    const { currentRoom } = useChatStore();

    return (
        <div className="flex h-screen bg-background">
            {/* WebSocket connection manager (hidden) */}
            <WebSocketManager />

            {/* Room list sidebar */}
            <RoomList />

            {/* Main content area */}
            <main className="flex-1">
                <div
                    className="flex-1 flex items-center justify-center"
                    aria-live="polite"
                    aria-label="No room selected"
                >
                    <p className="text-muted-foreground">
                        Select a room to start chatting
                    </p>
                </div>
            </main>
        </div>
    );
}