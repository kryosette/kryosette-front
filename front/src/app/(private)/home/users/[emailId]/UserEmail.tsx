'use client'

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/auth-provider';
import { checkSubscription, createPrivateRoom, createRoom, getFollowersCount, getUserEmail, subscribeToUser, unsubscribeFromUser } from './api';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, User, Key, MoreHorizontal, MessageSquare, Bell, Share2, Home, MessageCircle, Users, Settings, Bookmark, Video, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import OnlineStatus from '../../profile/status/online.status';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FriendsList } from '@/components/communication/friend/friend_list';

interface UserProfile {
    id: string;
    email: string;
    username: string;
    avatar?: string;
    status?: string;
    followers?: number;
    following?: number;
    isSubscribed?: boolean;
    isOnline: boolean;
    lastSeenAt?: string;
}

function UserEmail({ emailId, userId }: { emailId: string, userId: string }) {
    const [users, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token, user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUserEmail(emailId, token);
                const [isSubscribed, followersCount] = await Promise.all([
                    checkSubscription(emailId, token),
                    getFollowersCount(emailId, token)
                ]);
                setUser({
                    ...userData,
                    avatar: userData.avatar || `https://i.pravatar.cc/150?u=${userData.id}`,
                    status: "Online",
                    followers: followersCount,
                    following: 0,
                    isSubscribed,
                    isOnline: true
                });
            } catch (err: any) {
                setError('Не удалось загрузить пользователя: ' + (err.message || ''));
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchUser();
        } else {
            setError('Требуется авторизация');
            setLoading(false);
        }
    }, [emailId, token]);

    const handleSubscribe = async () => {
        if (!users || !token) return;

        try {
            if (users.isSubscribed) {
                await unsubscribeFromUser(emailId, token);
                toast.success('Вы отписались');
            } else {
                await subscribeToUser(emailId, token);
                toast.success('Вы подписались');
            }

            const [isSubscribed, followersCount] = await Promise.all([
                checkSubscription(emailId, token),
                getFollowersCount(emailId, token)
            ]);

            setUser(prev => ({
                ...prev!,
                isSubscribed,
                followers: followersCount
            }));
        } catch (err) {
            console.error('Subscription error:', err);
            toast.error('Ошибка при изменении подписки');
        }
    };

    const handleStartChat = async () => {
        try {
            const room = await createPrivateRoom(token, user?.userId, users?.id)
            router.push(`/home/room/private/${room.id}`);
            toast.success('Чат создан');
        } catch (err) {
            console.error('Ошибка при создании чата:', err);
            toast.error('Не удалось создать чат');
        }
    };

    if (loading) return (
        <div className="flex justify-center min-h-screen p-4 bg-white">
            <div className="flex w-full max-w-6xl gap-6">
                <Sidebar loading />
                <div className="flex-1">
                    <Card className="w-full border border-gray-200/50 bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <div className="flex items-center space-x-4">
                                <Skeleton className="h-16 w-16 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[200px]" />
                                    <Skeleton className="h-4 w-[150px]" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );

    if (error) return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 p-4"
        >
            {error}
        </motion.div>
    );

    if (!users) return (
        <div className="text-center p-8 text-gray-500">
            Пользователь не найден
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            {/* Анимированный фон профиля */}
            <div className="relative h-64 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20"
                />

                <motion.div
                    animate={{
                        backgroundPosition: ['0% 0%', '100% 100%'],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'linear',
                    }}
                    style={{
                        backgroundImage: `
                            linear-gradient(45deg, 
                                rgba(99, 102, 241, 0.2) 0%, 
                                rgba(168, 85, 247, 0.2) 20%, 
                                rgba(236, 72, 153, 0.2) 40%, 
                                rgba(239, 68, 68, 0.2) 60%, 
                                rgba(234, 179, 8, 0.2) 80%, 
                                rgba(99, 102, 241, 0.2) 100%)
                        `,
                        backgroundSize: '300% 300%',
                    }}
                    className="absolute inset-0"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
            </div>

            <div className="container mx-auto px-4 relative -mt-16 pb-12">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Боковое меню */}
                    <Sidebar />

                    {/* Основной контент */}
                    <div className="flex-1 space-y-6">
                        {/* Карточка профиля */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="border border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm">
                                <CardHeader className="relative">
                                    <div className="absolute top-4 right-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem>
                                                    Пожаловаться
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    Заблокировать
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            className="relative"
                                        >
                                            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                                                <AvatarImage src={users.avatar} />
                                                <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-3xl">
                                                    {users.username.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <motion.div
                                                animate={{
                                                    boxShadow: [
                                                        '0 0 0 0 rgba(99, 102, 241, 0.4)',
                                                        '0 0 0 10px rgba(99, 102, 241, 0)',
                                                        '0 0 0 0 rgba(99, 102, 241, 0)'
                                                    ],
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Infinity,
                                                    repeatDelay: 2
                                                }}
                                                className="absolute inset-0 rounded-full pointer-events-none"
                                            />
                                        </motion.div>

                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center space-x-3">
                                                <h2 className="text-2xl font-bold text-gray-800">
                                                    {users.username}
                                                </h2>
                                                <Badge variant="outline" className="flex items-center space-x-1">
                                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                    <OnlineStatus
                                                        userId={emailId}
                                                        initialStatus={users.isOnline || false}
                                                    />
                                                </Badge>
                                            </div>

                                            <div className="flex flex-wrap gap-4">
                                                <div className="flex items-center space-x-1 text-sm text-gray-600">
                                                    <span className="font-semibold">{users.followers}</span>
                                                    <span>подписчиков</span>
                                                </div>
                                                <div className="flex items-center space-x-1 text-sm text-gray-600">
                                                    <span className="font-semibold">{users.following}</span>
                                                    <span>подписок</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <motion.div
                                            whileHover={{ y: -2 }}
                                            className="flex items-center space-x-3 rounded-lg bg-gray-50/50 p-3 border border-gray-200/50"
                                        >
                                            <Mail className="h-5 w-5 text-blue-500" />
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <a href={`mailto:${users.username}`} className="font-medium text-blue-600 hover:underline">
                                                    {users.username}
                                                </a>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            whileHover={{ y: -2 }}
                                            className="flex items-center space-x-3 rounded-lg bg-gray-50/50 p-3 border border-gray-200/50"
                                        >
                                            <Key className="h-5 w-5 text-purple-500" />
                                            <div>
                                                <p className="text-sm text-gray-500">ID пользователя</p>
                                                <p className="font-medium">{users.id}</p>
                                            </div>
                                        </motion.div>
                                    </div>

                                    <motion.div
                                        whileHover={{ y: -2 }}
                                        className="rounded-lg bg-gray-50/50 p-4 border border-gray-200/50"
                                    >
                                        <h3 className="mb-2 text-sm font-semibold text-gray-700">О себе</h3>
                                        <p className="text-gray-600">
                                            Привет! Я {users.username}. Рад видеть вас на моей странице.
                                            Здесь вы можете найти мои контактные данные и другую информацию.
                                        </p>
                                    </motion.div>
                                </CardContent>

                                <CardFooter className="flex justify-between border-t border-gray-200/50 pt-4">
                                    <div className="flex flex-wrap gap-2">
                                        <motion.div whileHover={{ scale: 1.03 }}>
                                            <Button
                                                variant="default"
                                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                                onClick={handleStartChat}
                                            >
                                                <MessageSquare className="mr-2 h-4 w-4" />
                                                Написать
                                            </Button>
                                        </motion.div>

                                        <motion.div whileHover={{ scale: 1.03 }}>
                                            <Button
                                                variant={users.isSubscribed ? "outline" : "default"}
                                                onClick={handleSubscribe}
                                                className={users.isSubscribed ? "" : "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"}
                                            >
                                                <Bell className="mr-2 h-4 w-4" />
                                                {users.isSubscribed ? "Отписаться" : "Подписаться"}
                                            </Button>
                                        </motion.div>
                                    </div>

                                    <motion.div whileHover={{ scale: 1.1 }}>
                                        <Button variant="ghost" size="icon">
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                </CardFooter>
                            </Card>
                        </motion.div>


                    </div>
                </div>
            </div>
        </div>
    );
}

function Sidebar({ loading }: { loading?: boolean }) {
    const menuItems = [
        { icon: Home, label: "Моя страница" },
        { icon: MessageCircle, label: "Сообщения" },
        { icon: Users, label: "Друзья" },
        { icon: Video, label: "Видео" },
        { icon: Bookmark, label: "Закладки" },
        { icon: Settings, label: "Настройки" }
    ];

    return (
        <div className="hidden lg:block w-64 flex-shrink-0">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card className="sticky top-4 border border-gray-200/50 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <nav className="space-y-1">
                            {loading ? (
                                <>
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </>
                            ) : (
                                menuItems.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ x: 3 }}
                                    >
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start"
                                        >
                                            <item.icon className="mr-3 h-5 w-5" />
                                            {item.label}
                                        </Button>
                                    </motion.div>
                                ))
                            )}
                        </nav>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

export default UserEmail;