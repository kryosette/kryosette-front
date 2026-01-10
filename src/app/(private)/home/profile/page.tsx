'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    LogOut,
    User,
    Settings,
    Bell,
    MessageSquare,
    UserPlus,
    MoreHorizontal,
    Camera,
    Edit3,
    Users,
    TrendingUp,
    Clock,
    Heart
} from 'lucide-react';
import Link from "next/link";
import { useAuth } from '@/lib/auth-provider';
import { FriendRequestsDropdown } from '@/components/communication/friend/friend_req_dropdown';
import { SendFriendRequest } from '@/components/communication/friend/send_req_btn';
import PostList from '../posts/page';
import CreatePostForm from '../posts/create_post/page';
import { Input } from "@/components/ui/input";
import { NotificationList } from '@/components/notifications/notifications_list';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from '@/lib/utils';
import { FriendsList } from '@/components/communication/friend/friend_list';
import SettingsPage from '../settings/page';

interface UserDto {
    id: number;
    username: string;
    lastname: string;
    email: string;
    firstname?: string;
    userId?: string;
}

const BACKEND_URL = "http://localhost:8088";

function ProfilePage() {
    const [user, setUser] = useState<UserDto | null>(null);
    const [loading, setLoading] = useState(true);
    const storedToken = sessionStorage.getItem('token');
    console.log("DEBUG: AUTH:", storedToken);
    const { token, logout } = useAuth();
    const router = useRouter();
    const [newFirstname, setNewFirstname] = useState('');
    const [newLastname, setNewLastname] = useState('');
    const [updateError, setUpdateError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('posts');
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);

    // Анимация шапки
    const headerOpacity = useTransform(scrollY, [0, 100], [0.9, 1]);
    const headerBlur = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(20px)']);

    useEffect(() => {
        const unsubscribe = scrollY.on("change", (y) => {
            setIsScrolled(y > 10);
        });
        return () => unsubscribe();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        console.log("DEBUG [fetchProfile]: storedToken =", storedToken);
        console.log("DEBUG [fetchProfile]: typeof storedToken =", typeof storedToken);
        try {
            const response = await fetch(`${BACKEND_URL}/api/v1/user/me`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                setNewFirstname(userData.firstname || '');
                setNewLastname(userData.lastname || '');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const handleUpdateProfile = async () => {
        setUpdateError('');
        try {
            const response = await fetch(`${BACKEND_URL}/api/v1/user/update`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstname: newFirstname,
                    lastname: newLastname,
                }),
            });

            if (!response.ok) {
                setUpdateError('Failed to update profile. Please try again.');
                return;
            }

            const updatedUser = await response.json();
            setUser(updatedUser);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            setUpdateError('Error connecting to the server.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-8 w-8 rounded-full border-2 border-gray-800 border-t-transparent"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Минималистичная шапка */}
            <motion.header
                style={{
                    opacity: headerOpacity,
                    backdropFilter: headerBlur,
                }}
                className={cn(
                    "fixed top-0 z-50 w-full transition-all duration-300 border-b",
                    isScrolled ? "bg-white/80 border-gray-100" : "bg-transparent border-transparent"
                )}
            >
                <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                    <Link href="/home" className="text-2xl font-bold text-gray-900 tracking-tight">
                        kryosette
                    </Link>

                    <div className="flex items-center space-x-1">
                        <NotificationList />
                        <FriendRequestsDropdown>
                            <Button variant="outline" size="sm" className="relative border-indigo-300 hover:bg-indigo-50">
                                <Bell className="h-4 w-4" />
                            </Button>
                        </FriendRequestsDropdown>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center space-x-2 px-2 h-8 text-gray-600 hover:text-gray-900">
                                    <Avatar className="h-7 w-7">
                                        <AvatarFallback className="bg-gray-800 text-white text-xs font-medium">
                                            {user?.firstname?.[0]}{user?.lastname?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48" align="end">
                                <DropdownMenuItem onClick={() => router.push('/home/profile')}>
                                    <User className="mr-2 h-4 w-4" />
                                    <span className="font-normal">Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push('/home/settings')}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span className="font-normal">Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span className="font-normal">Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </motion.header>

            {/* Чистый фон профиля */}
            <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />

                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent" />

                <div className="container mx-auto px-6 relative h-full flex flex-col justify-end pb-6">
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-end justify-between"
                    >
                        <div className="flex items-end gap-6">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="relative group"
                            >
                                <Avatar className="h-20 w-20 border-4 border-white bg-white">
                                    <AvatarFallback className="bg-gray-800 text-white text-lg font-medium">
                                        {user?.firstname?.[0]}{user?.lastname?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera className="h-5 w-5 text-white" />
                                </div>
                            </motion.div>

                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-5 tracking-tight">
                                    {user?.username}
                                </h1>
                                <p className="text-gray-500 text-sm font-normal mt-1">
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <SendFriendRequest>
                                <Button variant="outline" size="sm" className="h-8 border-gray-300 text-gray-700 hover:bg-gray-50 font-normal">
                                    <UserPlus className="h-3.5 w-3.5 mr-2" />
                                    Add Friend
                                </Button>
                            </SendFriendRequest>

                            <Link href={"/home/chat/chats"}>
                                <Button variant="outline" size="sm" className="h-8 border-gray-300 text-gray-700 hover:bg-gray-50 font-normal">
                                    <MessageSquare className="h-3.5 w-3.5 mr-2" />
                                    Message
                                </Button>
                            </Link>

                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 border-gray-300 text-gray-700 hover:bg-gray-50"
                                onClick={() => setIsEditing(true)}
                            >
                                <Edit3 className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Основной контент */}
            <div className="container mx-auto px-6 pb-12 -mt-4 relative z-10">
                {/* Прозрачные табы без бордеров */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="w-full justify-start space-x-8 bg-transparent p-0 h-10">
                            <TabsTrigger
                                value="posts"
                                className="relative h-full px-0 text-gray-500 data-[state=active]:text-gray-900 font-normal bg-transparent"
                            >
                                <span className="px-3 py-1 text-sm">Posts</span>
                                {activeTab === 'posts' && (
                                    <motion.div
                                        layoutId="profileTabIndicator"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
                                    />
                                )}
                            </TabsTrigger>
                            <TabsTrigger
                                value="friends"
                                className="relative h-full px-0 text-gray-500 data-[state=active]:text-gray-900 font-normal bg-transparent"
                            >
                                <span className="px-3 py-1 text-sm">Friends</span>
                                {activeTab === 'friends' && (
                                    <motion.div
                                        layoutId="profileTabIndicator"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
                                    />
                                )}
                            </TabsTrigger>
                            <TabsTrigger
                                value="settings"
                                className="relative h-full px-0 text-gray-500 data-[state=active]:text-gray-900 font-normal bg-transparent"
                            >
                                <span className="px-3 py-1 text-sm">Settings</span>
                                {activeTab === 'settings' && (
                                    <motion.div
                                        layoutId="profileTabIndicator"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
                                    />
                                )}
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                    {/* Левая боковая колонка */}
                    <div className="lg:col-span-3 space-y-4">
                        {/* Статистика профиля */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Card className="border border-black/10 bg-white shadow-sm">
                                <CardContent className="p-4">
                                    <h3 className="text-sm font-medium text-black/80 mb-3">Profile Stats</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Users className="h-4 w-4 text-black/60" />
                                                <span className="text-sm text-black/70">Friends</span>
                                            </div>
                                            <span className="text-sm font-medium text-black">127</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <TrendingUp className="h-4 w-4 text-black/60" />
                                                <span className="text-sm text-black/70">Posts</span>
                                            </div>
                                            <span className="text-sm font-medium text-black">42</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Heart className="h-4 w-4 text-black/60" />
                                                <span className="text-sm text-black/70">Likes</span>
                                            </div>
                                            <span className="text-sm font-medium text-black">1.2K</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Недавняя активность */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Card className="border border-black/10 bg-white shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="space-y-3 px-4 pb-4">
                                        <div className="flex items-start space-x-3">
                                            <Avatar className="h-6 w-6">
                                                <AvatarFallback className="text-xs bg-blue-100 text-blue-600">J</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <p className="text-xs text-black/80">Liked your post</p>
                                                <p className="text-xs text-black/50">2 hours ago</p>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="flex items-start space-x-3">
                                            <Avatar className="h-6 w-6">
                                                <AvatarFallback className="text-xs bg-green-100 text-green-600">M</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <p className="text-xs text-black/80">Commented on your photo</p>
                                                <p className="text-xs text-black/50">5 hours ago</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Центральная колонка - Основной контент */}
                    <div className={cn(
                        "space-y-4",
                        activeTab === 'friends' ? "lg:col-span-6" : "lg:col-span-6"
                    )}>
                        {activeTab === 'posts' && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <CreatePostForm />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <PostList />
                                </motion.div>
                            </>
                        )}

                        {activeTab === 'friends' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <FriendsList />
                            </motion.div>
                        )}

                        {activeTab === 'settings' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <SettingsPage />
                            </motion.div>
                        )}
                    </div>

                    {/* Правая боковая колонка */}
                    <div className="lg:col-span-3 space-y-4">
                        {/* Популярные хештеги */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Card className="border border-black/10 bg-white shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium">Trending Hashtags</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="space-y-2 px-4 pb-4">
                                        {['#technology', '#design', '#programming', '#art', '#music'].map((tag, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                                                    {tag}
                                                </span>
                                                <span className="text-xs text-black/50">24.{index + 1}K</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Рекомендации друзей */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Card className="border border-black/10 bg-white shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium">People You May Know</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="space-y-3 px-4 pb-4">
                                        {[
                                            { name: 'Alex Johnson', mutual: 12 },
                                            { name: 'Sarah Miller', mutual: 8 },
                                            { name: 'Mike Chen', mutual: 5 }
                                        ].map((person, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className="text-xs bg-gray-100 text-gray-600">
                                                            {person.name.split(' ').map(n => n[0]).join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-medium text-black">{person.name}</p>
                                                        <p className="text-xs text-black/50">{person.mutual} mutual friends</p>
                                                    </div>
                                                </div>
                                                <Button size="sm" className="h-7 text-xs bg-black text-white hover:bg-black/80">
                                                    Add
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Минималистичное модальное окно редактирования */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden border border-gray-200"
                        >
                            <div className="p-6">
                                <h2 className="text-lg font-normal mb-4 text-gray-900">Edit Profile</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-normal text-gray-600 mb-2">First Name</label>
                                        <Input
                                            value={newFirstname}
                                            onChange={(e) => setNewFirstname(e.target.value)}
                                            className="w-full border-gray-300 focus:border-gray-400 font-normal"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-normal text-gray-600 mb-2">Last Name</label>
                                        <Input
                                            value={newLastname}
                                            onChange={(e) => setNewLastname(e.target.value)}
                                            className="w-full border-gray-300 focus:border-gray-400 font-normal"
                                        />
                                    </div>
                                    {updateError && (
                                        <p className="text-sm text-red-500 font-normal">{updateError}</p>
                                    )}
                                </div>
                            </div>
                            <div className="px-6 py-4 flex justify-end space-x-3 border-t border-gray-100">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsEditing(false)}
                                    className="text-gray-600 hover:text-gray-900 font-normal h-8"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleUpdateProfile}
                                    size="sm"
                                    className="bg-gray-900 text-white hover:bg-gray-800 font-normal h-8"
                                >
                                    Save
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default ProfilePage;