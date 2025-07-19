'use client'

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/auth-provider';
import { checkSubscription, getFollowersCount, getUserEmail, subscribeToUser, unsubscribeFromUser } from './api';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, User, Key, MoreHorizontal, MessageSquare, Bell, Share2, Home, MessageCircle, Users, Settings, Bookmark, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import OnlineStatus from '../../profile/status/online.status';

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

function UserEmail({ emailId }: { emailId: string }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);

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
                    followers: getFollowersCount(emailId, token),
                    following: 0,
                    isSubscribed
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
        if (!user || !token) return;

        try {
            if (user.isSubscribed) {
                await unsubscribeFromUser(emailId, token);
            } else {
                await subscribeToUser(emailId, token);
            }

            // Обновляем состояние после изменения подписки
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
            setError('Ошибка при изменении подписки');
        }
    };

    if (loading) return (
        <div className="flex justify-center min-h-screen p-4">
            <div className="flex w-full max-w-6xl gap-6">
                <Sidebar loading />
                <div className="flex-1">
                    <Card className="w-full">
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

    if (error) return <div className="text-red-500">{error}</div>;
    if (!user) return <div>Пользователь не найден</div>;

    return (
        <div className="flex justify-center min-h-screen p-4 bg-gray-50">
            <div className="flex w-full max-w-6xl gap-6">
                {/* Левое меню как во ВК */}
                <Sidebar />

                {/* Основной контент */}
                <div className="flex-1 space-y-6">
                    {/* Карточка профиля */}
                    <Card className="w-full shadow-sm">
                        <CardHeader className="relative">
                            <div className="absolute top-4 right-4">
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="flex items-start space-x-6">
                                <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>

                                <div className="flex-1 pt-2">
                                    <div className="flex items-center space-x-3">
                                        <h2 className="text-2xl font-bold">{user.username}</h2>
                                        <Badge variant="outline" className="flex items-center space-x-1">
                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                            <OnlineStatus
                                                userId={emailId}
                                                initialStatus={profile?.isOnline || false}
                                            />
                                        </Badge>
                                    </div>

                                    <div className="mt-3 flex space-x-4">
                                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                                            <span className="font-semibold">{user.followers}</span>
                                            <span>подписчиков</span>
                                        </div>
                                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                                            <span className="font-semibold">{user.following}</span>
                                            <span>подписок</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
                                    <Mail className="h-5 w-5 text-blue-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <a href={`mailto:${user.email}`} className="font-medium text-blue-600 hover:underline">
                                            {user.email}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
                                    <Key className="h-5 w-5 text-purple-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">ID пользователя</p>
                                        <p className="font-medium">{user.id}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4">
                                <h3 className="mb-2 text-sm font-semibold text-gray-700">О себе</h3>
                                <p className="text-gray-600">
                                    Привет! Я {user.username}. Рад видеть вас на моей странице.
                                    Здесь вы можете найти мои контактные данные и другую информацию.
                                </p>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-between border-t pt-4">
                            <div className="flex space-x-2">
                                <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Написать
                                </Button>
                                <Button
                                    variant={user.isSubscribed ? "outline" : "default"}
                                    onClick={handleSubscribe}
                                >
                                    <Bell className="mr-2 h-4 w-4" />
                                    {user.isSubscribed ? "Отписаться" : "Подписаться"}
                                </Button>
                            </div>
                            <Button variant="ghost">
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Блок друзей */}
                    <Card className="w-full shadow-sm">
                        <CardHeader>
                            <h3 className="text-xl font-semibold">Друзья</h3>
                            <p className="text-sm text-gray-500">123 друга</p>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {[1, 2, 3, 4, 5, 6].map((_, i) => (
                                    <div key={i} className="flex flex-col items-center space-y-2">
                                        <Avatar className="h-20 w-20">
                                            <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 10}`} />
                                            <AvatarFallback>F</AvatarFallback>
                                        </Avatar>
                                        <p className="text-sm font-medium">Friend {i + 1}</p>
                                    </div>
                                ))}
                                <div className="flex flex-col items-center justify-center space-y-2">
                                    <Button variant="outline" className="h-20 w-20 rounded-full">
                                        <span className="text-2xl">+</span>
                                    </Button>
                                    <p className="text-sm font-medium">Показать всех</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// Компонент бокового меню
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
        <div className="hidden md:block w-64 flex-shrink-0">
            <Card className="sticky top-4">
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
                                <Button
                                    key={index}
                                    variant="ghost"
                                    className="w-full justify-start"
                                >
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.label}
                                </Button>
                            ))
                        )}
                    </nav>
                </CardContent>
            </Card>
        </div>
    );
}

export default UserEmail;