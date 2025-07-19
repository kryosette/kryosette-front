'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from '@/lib/auth-provider';
import './StatusIndicator.css';

export default function UserStatusPage() {
    const params = useParams();
    const userId = params?.userId as string;
    const [isOnline, setIsOnline] = useState<boolean>(false);
    const { token } = useAuth();

    useEffect(() => {
        if (!userId || !token) return;

        // 1. Загружаем начальный статус
        const fetchStatus = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/status/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                setIsOnline(data.online);
            } catch (error) {
                console.error('Error fetching status:', error);
            }
        };

        fetchStatus();

        // 2. Настраиваем WebSocket
        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            connectHeaders: { Authorization: `Bearer ${token}` },
            onConnect: () => {
                // Подписка на обновления статуса
                client.subscribe(`/topic/status/${userId}`, (message) => {
                    const status = JSON.parse(message.body);
                    setIsOnline(status.online);
                });

                // Устанавливаем статус "онлайн"
                client.publish({
                    destination: '/app/status.update',
                    body: JSON.stringify({ online: true })
                });
            },
            onDisconnect: () => {
                // При отключении пытаемся установить статус "оффлайн"
                updateOfflineStatus();
            }
        });

        client.activate();

        // 3. Обработчики событий страницы
        const updateOfflineStatus = () => {
            fetch('http://localhost:8080/api/status/' + userId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ online: false })
            }).catch(() => { });
        };

        const handleBeforeUnload = () => updateOfflineStatus();

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            updateOfflineStatus();
            client.deactivate();
        };
    }, [userId, token]);

    return (
        <div className="status-indicator">
            <span className={`status-dot ${isOnline ? 'online' : 'offline'}`} />
            <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>
    );
}