'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from '@/lib/auth-provider';
import './StatusIndicator.css';

/**
 * UserStatusPage Component
 * 
 * @component
 * @description
 * Displays and manages a user's online/offline status with real-time updates via WebSocket.
 * Features:
 * - Initial status fetch via HTTP
 * - Real-time updates via WebSocket
 * - Automatic offline status on disconnection
 * - Visual status indicator
 * 
 * @state {boolean} isOnline - Current online status of the user
 * 
 * @effect
 * - On mount: Fetches initial status and sets up WebSocket connection
 * - On unmount: Cleans up WebSocket connection and sets offline status
 */
export default function UserStatusPage() {
    const params = useParams();
    const userId = params?.userId as string;
    const [isOnline, setIsOnline] = useState<boolean>(false);
    // @ts-ignore
    const { token } = useAuth();

    useEffect(() => {
        if (!userId || !token) return;

        /**
         * Fetches the initial user status from the server
         * @async
         */
        const fetchInitialStatus = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/status/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                setIsOnline(data.online);
            } catch (error) {
                console.error('Error fetching initial status:', error);
            }
        };

        /**
         * Updates the user status to offline
         * @async
         */
        const updateOfflineStatus = async () => {
            try {
                await fetch(`http://localhost:8080/api/status/${userId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ online: false })
                });
            } catch (error) {
                console.error('Error updating offline status:', error);
            }
        };

        // Fetch initial status
        fetchInitialStatus();

        // Configure WebSocket connection
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: { Authorization: `Bearer ${token}` },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,

            onConnect: () => {
                // Subscribe to status updates
                stompClient.subscribe(`/topic/status/${userId}`, (message) => {
                    try {
                        const status = JSON.parse(message.body);
                        setIsOnline(status.online);
                    } catch (error) {
                        console.error('Error parsing status update:', error);
                    }
                });

                // Set initial online status
                stompClient.publish({
                    destination: '/app/status.update',
                    body: JSON.stringify({ userId, online: true })
                });
            },

            onStompError: (frame) => {
                console.error('WebSocket error:', frame.headers.message);
                setIsOnline(false);
            },

            onDisconnect: () => {
                updateOfflineStatus();
            }
        });

        stompClient.activate();

        // Setup page event listeners
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                stompClient.publish({
                    destination: '/app/status.update',
                    body: JSON.stringify({ userId, online: true })
                });
            }
        };

        window.addEventListener('beforeunload', updateOfflineStatus);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            // Cleanup
            window.removeEventListener('beforeunload', updateOfflineStatus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            updateOfflineStatus();
            stompClient.deactivate();
        };
    }, [userId, token]);

    return (
        <div className="status-indicator" aria-live="polite">
            <span
                className={`status-dot ${isOnline ? 'online' : 'offline'}`}
                aria-label={isOnline ? 'Online' : 'Offline'}
            />
            <span className="status-text">
                {isOnline ? 'Online' : 'Offline'}
            </span>
        </div>
    );
}