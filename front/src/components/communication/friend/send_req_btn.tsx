'use client';

import { Button } from '@/components/ui/button';
import { useToasts } from '@/hooks/use_toats';
import { useAuth } from '@/lib/auth-provider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '../../ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';

export function SendFriendRequest() {
    const [userId, setUserId] = useState('');
    const queryClient = useQueryClient();
    const { success, error, warning } = useToasts();
    const { token } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationFn: async (receiverId: number) => {
            console.log("Token inside mutationFn:", token); // Log the token
            try {
                console.log("Sending friend request to:", receiverId); // Log the receiverId
                const response = await axios.post(
                    `http://localhost:8088/api/v1/friends/request/${receiverId}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    }
                );
                if (response.status === 200) {
                    toast.success('d')
                }
                return response.data;
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    error('Ошибка', err.response?.data?.message || 'Не удалось отправить заявку');
                } else {
                    error('Ошибка', 'Произошла неизвестная ошибка');
                }
                throw err;
            }
        },
        onSuccess: () => {
            setUserId('');
            queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        console.log("Form submitted!"); // Log when form is submitted
        e.preventDefault();
        const id = Number(userId);

        if (!id || isNaN(id)) {
            warning('Некорректный ID', 'Пожалуйста, введите числовой ID пользователя');
            return;
        }

        if (id <= 0) {
            warning('Некорректный ID', 'ID должен быть положительным числом');
            return;
        }

        mutate(id);
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Добавить друга
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-2" align="end">
                <form onSubmit={handleSubmit} className="space-y-2">
                    <DropdownMenuItem className="p-0" onSelect={(e) => e.preventDefault()}>
                        <Input
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="Введите ID пользователя"
                            className="border-0 focus-visible:ring-0 shadow-none"
                        />
                    </DropdownMenuItem>
                    <Button
                        type="submit"
                        size="sm"
                        className="w-full"
                        disabled={isPending || !userId.trim()}
                    >
                        {isPending ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin">↻</span>
                                Отправка...
                            </span>
                        ) : (
                            'Отправить заявку'
                        )}
                    </Button>
                </form>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}