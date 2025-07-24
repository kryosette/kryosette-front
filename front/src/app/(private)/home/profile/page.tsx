'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Home,
    PlusSquare,
    CreditCard,
    LogOut,
    User,
    Mail,
    UserPlus,
    Bell,
    Menu,
    X,
    MoreHorizontal,
    Users,
    MessageSquare,
    Settings,
    Globe,
    Image as ImageIcon,
    Video,
    Smile,
    MapPin,
    GanttChart,
    Sparkles
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
    const { token, logout } = useAuth();
    const router = useRouter();
    const [newFirstname, setNewFirstname] = useState('');
    const [newLastname, setNewLastname] = useState('');
    const [updateError, setUpdateError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('posts');
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);

    // Анимация прозрачности шапки
    const headerOpacity = useTransform(scrollY, [0, 100], [0.9, 1]);
    const headerBlur = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(2px)']);
    const headerScale = useTransform(scrollY, [0, 100], [1, 0.98]);

    useEffect(() => {
        const unsubscribe = scrollY.on("change", (y) => {
            setIsScrolled(y > 10);
        });
        return () => unsubscribe();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BACKEND_URL}/api/v1/user/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
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
                    className="h-12 w-12 rounded-full border-2 border-indigo-500 border-t-transparent"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Анимированная шапка */}
            <motion.header
                style={{
                    opacity: headerOpacity,
                    backdropFilter: headerBlur,
                    scale: headerScale
                }}
                className={cn(
                    "fixed top-0 z-50 w-full transition-all duration-300",
                    isScrolled ? "bg-white/80 border-b border-gray-200/50 shadow-sm" : "bg-transparent"
                )}
            >
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2"
                    >
                        <Sparkles className="h-5 w-5 text-indigo-500" />
                        <Link href="/home" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            kryosette
                        </Link>
                    </motion.div>

                    <div className="flex items-center space-x-3">
                        <NotificationList />
                        <FriendRequestsDropdown>
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                                </Button>
                            </motion.div>
                        </FriendRequestsDropdown>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <motion.div whileHover={{ scale: 1.03 }}>
                                    <Button variant="ghost" className="flex items-center space-x-2 px-2">
                                        <Avatar className="h-8 w-8 border border-indigo-200">
                                            <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                                                {user?.firstname?.[0]}{user?.lastname?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </motion.div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuItem onClick={() => router.push('/home/profile')}>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push('/home/settings')}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </motion.header>

            {/* Анимированный фон профиля */}
            <div className="relative h-96 overflow-hidden">
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

                <div className="container mx-auto px-4 relative h-full flex flex-col justify-end pb-12">
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col md:flex-row items-start md:items-end gap-6"
                    >
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative"
                        >
                            <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                                <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-4xl">
                                    {user?.firstname?.[0]}{user?.lastname?.[0]}
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

                        <div className="md:ml-6 mt-4 md:mt-0 flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800 drop-shadow-sm">
                                        {user?.firstname || 'User'} {user?.lastname}
                                    </h1>
                                    <p className="text-gray-600 flex items-center mt-1">
                                        <Mail className="h-4 w-4 mr-2" />
                                        {user?.email}
                                    </p>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex flex-wrap gap-2"
                                >
                                    <SendFriendRequest>
                                        <motion.div whileHover={{ y: -2 }}>
                                            <Button variant="outline" className="flex items-center bg-white/80 backdrop-blur-sm">
                                                <UserPlus className="h-4 w-4 mr-2" />
                                                Add Friend
                                            </Button>
                                        </motion.div>
                                    </SendFriendRequest>

                                    <motion.div whileHover={{ y: -2 }}>
                                        <Button variant="outline" className="bg-white/80 backdrop-blur-sm">
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            Message
                                        </Button>
                                    </motion.div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <motion.div whileHover={{ y: -2 }}>
                                                <Button variant="outline" size="icon" className="bg-white/80 backdrop-blur-sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </motion.div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                                Edit Profile
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Основной контент */}
            <div className="container mx-auto px-4 pb-12 -mt-8 relative z-10">
                {/* Навигация профиля */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="border-b border-gray-200"
                >
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="w-full justify-start space-x-8 bg-transparent p-0 h-14">
                            <TabsTrigger value="posts" className="relative h-full px-0">
                                <span className="px-4 py-2">Posts</span>
                                {activeTab === 'posts' && (
                                    <motion.div
                                        layoutId="profileTabIndicator"
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 rounded-t"
                                    />
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="about" className="relative h-full px-0">
                                <span className="px-4 py-2">About</span>
                                {activeTab === 'about' && (
                                    <motion.div
                                        layoutId="profileTabIndicator"
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 rounded-t"
                                    />
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="friends" className="relative h-full px-0">
                                <span className="px-4 py-2">Friends</span>
                                {activeTab === 'friends' && (
                                    <motion.div
                                        layoutId="profileTabIndicator"
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 rounded-t"
                                    />
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="photos" className="relative h-full px-0">
                                <span className="px-4 py-2">Photos</span>
                                {activeTab === 'photos' && (
                                    <motion.div
                                        layoutId="profileTabIndicator"
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 rounded-t"
                                    />
                                )}
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
                    {/* Левая колонка - О себе */}
                    <div className="lg:col-span-1 space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Card className="rounded-lg shadow-sm border border-gray-200/50 bg-white/80 backdrop-blur-sm">
                                <CardHeader className="border-b border-gray-200/50">
                                    <CardTitle className="text-lg">About</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Username</h3>
                                        <p className="mt-1 text-sm">{user?.username}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                        <p className="mt-1 text-sm">{user?.email}</p>
                                    </div>
                                    <motion.div whileHover={{ scale: 1.01 }}>
                                        <Button
                                            variant="outline"
                                            className="w-full bg-white/80"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Edit Details
                                        </Button>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Card className="rounded-lg shadow-sm border border-gray-200/50 bg-white/80 backdrop-blur-sm">
                                <CardHeader className="border-b border-gray-200/50">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">Friends</CardTitle>
                                        <span className="text-sm text-gray-500">123</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="grid grid-cols-3 gap-2">
                                        {[1, 2, 3, 4, 5, 6].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                whileHover={{ y: -3 }}
                                                className="flex flex-col items-center"
                                            >
                                                <Avatar className="h-20 w-20 mb-1 border border-gray-200">
                                                    <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 10}`} />
                                                    <AvatarFallback>F</AvatarFallback>
                                                </Avatar>
                                                <p className="text-xs text-center truncate w-full">Friend {i + 1}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <motion.div whileHover={{ scale: 1.01 }}>
                                        <Button variant="ghost" className="w-full mt-3 text-indigo-600">
                                            See All Friends
                                        </Button>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Центральная колонка - Посты */}
                    <div className="lg:col-span-2 space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <CreatePostForm />
                        </motion.div>

                        <AnimatePresence>
                            {activeTab === 'posts' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <PostList />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Правая колонка - Активность */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Card className="rounded-lg shadow-sm border border-gray-200/50 bg-white/80 backdrop-blur-sm">
                                <CardHeader className="border-b border-gray-200/50">
                                    <CardTitle className="text-lg">Activity</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4">
                                    <motion.div
                                        whileHover={{ x: 3 }}
                                        className="flex items-start space-x-3"
                                    >
                                        <Avatar className="h-10 w-10 border border-indigo-100">
                                            <AvatarFallback className="bg-indigo-100 text-indigo-600">Y</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">You posted an update</p>
                                            <p className="text-xs text-gray-500">3 hours ago</p>
                                        </div>
                                    </motion.div>
                                    <Separator className="bg-gray-200/50" />
                                    <motion.div
                                        whileHover={{ x: 3 }}
                                        className="flex items-start space-x-3"
                                    >
                                        <Avatar className="h-10 w-10 border border-pink-100">
                                            <AvatarFallback className="bg-pink-100 text-pink-600">F</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">Friend liked your post</p>
                                            <p className="text-xs text-gray-500">5 hours ago</p>
                                        </div>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Модальное окно редактирования профиля */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-gray-200/50"
                        >
                            <div className="p-6">
                                <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <Input
                                            value={newFirstname}
                                            onChange={(e) => setNewFirstname(e.target.value)}
                                            className="w-full bg-gray-50/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <Input
                                            value={newLastname}
                                            onChange={(e) => setNewLastname(e.target.value)}
                                            className="w-full bg-gray-50/50"
                                        />
                                    </div>
                                    {updateError && (
                                        <p className="text-sm text-red-500">{updateError}</p>
                                    )}
                                </div>
                            </div>
                            <div className="bg-gray-50/50 px-6 py-3 flex justify-end space-x-3 border-t border-gray-200/50">
                                <motion.div whileHover={{ scale: 1.03 }}>
                                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.03 }}>
                                    <Button onClick={handleUpdateProfile} className="bg-gradient-to-r from-indigo-600 to-purple-600">
                                        Save Changes
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default ProfilePage;