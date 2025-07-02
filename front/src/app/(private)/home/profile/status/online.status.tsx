// OnlineStatus.tsx
import { useEffect, useState } from 'react';
import { statusService } from './class.service';
import { useAuth } from '@/lib/auth-provider';

interface OnlineStatusProps {
    userId: string;
    initialStatus: boolean;
}

export const OnlineStatus = ({ userId, initialStatus }: OnlineStatusProps) => {
    const [isOnline, setIsOnline] = useState(initialStatus);
    const { token } = useAuth();

    useEffect(() => {
        statusService.connect(userId, token, (status) => {
            setIsOnline(status);
        });


        return () => {
            statusService.disconnect();
        };
    }, [userId, token]);

    return (
        <div className={`status ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? 'Online' : 'Offline'}
        </div>
    );
};