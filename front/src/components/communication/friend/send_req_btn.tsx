'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import { useFriendRequests } from '@/lib/hooks/use_friend_req';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import axios from 'axios';
import { useAuth } from '@/lib/auth-provider';
import { useQueryClient } from '@tanstack/react-query';

const API_URL = 'http://localhost:8088/api/v1';

export function SendFriendRequest() {
    const { token } = useAuth();
    const [userId, setUserId] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    const handleSubmit = async () => {
        const id = String(userId.trim());



        try {
            setIsLoading(true);

            const response = await axios.post(
                `${API_URL}/friends/request/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            toast.success('Заявка отправлена успешно!');
            queryClient.invalidateQueries(['friendRequests']);
            setUserId('');
            setIsOpen(false);
        } catch (error: any) {
            console.error('Ошибка при отправке заявки:', error);
            toast.error(error.response?.data?.message || 'Не удалось отправить заявку');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Добавить друга
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Отправить заявку в друзья</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Input
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="Введите ID пользователя"
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    />
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !userId.trim()}
                    >
                        {isLoading ? 'Отправка...' : 'Отправить заявку'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}