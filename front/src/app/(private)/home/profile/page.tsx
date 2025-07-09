'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useDragControls } from 'framer-motion';
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
    Move
} from 'lucide-react';
import Link from "next/link";
import { useAuth } from '@/lib/auth-provider';
import { FriendRequestsDropdown } from '@/components/communication/friend/friend_req_dropdown';
import { SendFriendRequest } from '@/components/communication/friend/send_req_btn';
import PostList from '../posts/page';
import CreatePostForm from '../posts/create_post/page';
import { Input } from "@/components/ui/input";
import { OpenChatButton } from '../chat/chats/chatbutton';
import { NotificationList } from '@/components/notifications/notifications_list';

interface UserDto {
    id: number;
    username: string;
    lastname: string;
    email: string;
    firstname?: string;
    userId?: string;
}

const BACKEND_URL = "http://localhost:8088";

const navItems = [
    { icon: <Home size={20} />, title: 'Posts', href: '/home/posts' },
    { icon: <PlusSquare size={20} />, title: 'Create', href: '/home/posts/create_post' },
    { icon: <CreditCard size={20} />, title: 'Payment', href: '/home/payment' },
];

function ProfilePage() {
    const [user, setUser] = useState<UserDto | null>(null);
    const [loading, setLoading] = useState(true);
    const { token, logout } = useAuth();
    const router = useRouter();
    const [navPosition, setNavPosition] = useState({ x: 20, y: 100 });
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);
    const dragControls = useDragControls();
    const [newFirstname, setNewFirstname] = useState('');
    const [newLastname, setNewLastname] = useState('');
    const [updateError, setUpdateError] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
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

        if (token) fetchProfile();

        const savedPos = localStorage.getItem('navPosition');
        if (savedPos) setNavPosition(JSON.parse(savedPos));
    }, [token]);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const handleDragEnd = (event: any, info: any) => {
        const newPos = {
            x: navPosition.x + info.offset.x,
            y: navPosition.y + info.offset.y
        };

        const windowWidth = window.innerWidth;
        if (newPos.x < windowWidth / 2) {
            newPos.x = 20;
        } else {
            newPos.x = windowWidth - (isNavCollapsed ? 60 : 180) - 20;
        }

        setNavPosition(newPos);
        localStorage.setItem('navPosition', JSON.stringify(newPos));
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
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
            {/* Floating Navigation */}
            <motion.div
                drag
                dragControls={dragControls}
                dragListener={true}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
                initial={navPosition}
                animate={navPosition}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`fixed z-50 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden transition-all duration-300 ${isNavCollapsed ? 'w-14' : 'w-56'
                    }`}
                style={{
                    boxShadow: '0 10px 30px -10px rgba(99, 102, 241, 0.2)'
                }}
            >
                <div className="flex h-full" style={{ flexDirection: !isNavCollapsed ? 'row' : 'column' }}>
                    <div
                        className={`p-2 flex items-center justify-start cursor-move ${!isNavCollapsed ? 'w-auto border-x border-gray-200/50' : 'w-full border-b border-gray-200/50'
                            }`}
                    >
                        <button
                            onClick={() => setIsNavCollapsed(!isNavCollapsed)}
                            className="p-1 rounded-full hover:bg-indigo-50 text-indigo-500 transition-colors"
                        >
                            {isNavCollapsed ? <Menu size={16} className='ml-2' /> : <X size={16} />}
                        </button>
                    </div>

                    <nav className={`flex ${!isNavCollapsed ? 'flex-row items-center space-x-1' : 'flex-col items-start space-y-2'
                        }`}
                    >
                        {navItems.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                className={`flex items-center p-3 ml-1 rounded-lg hover:bg-indigo-50 text-indigo-900 transition-colors ${isNavCollapsed ? 'justify-center' : ''
                                    }`}
                                title={isNavCollapsed ? item.title : undefined}
                            >
                                <span className={isNavCollapsed ? '' : 'mr-3'}>{item.icon}</span>
                                {!isNavCollapsed && <span className="text-sm font-medium">{item.title}</span>}
                            </Link>
                        ))}
                    </nav>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto pt-16">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-200/50 backdrop-blur-sm bg-white/90">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center space-x-6">
                            <Avatar className="h-20 w-20 border-4 border-white shadow-md">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                                    {user?.firstname?.[0]}{user?.lastname?.[0]}
                                </AvatarFallback>
                            </Avatar>

                            <div className="space-y-2">
                                {isEditing ? (
                                    <div className="space-y-3">
                                        <div className="flex space-x-2">
                                            <Input
                                                type="text"
                                                value={newFirstname}
                                                onChange={(e) => setNewFirstname(e.target.value)}
                                                className="bg-gray-50 border-gray-200"
                                                placeholder="First name"
                                            />
                                            <Input
                                                type="text"
                                                value={newLastname}
                                                onChange={(e) => setNewLastname(e.target.value)}
                                                className="bg-gray-50 border-gray-200"
                                                placeholder="Last name"
                                            />
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                onClick={handleUpdateProfile}
                                                className="bg-indigo-600 hover:bg-indigo-700"
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setIsEditing(false)}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                        {updateError && (
                                            <p className="text-sm text-red-500">{updateError}</p>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <h1 className="text-3xl font-bold text-gray-800">
                                            {user?.firstname || 'User'} {user?.lastname}
                                        </h1>
                                        <div className="flex items-center text-gray-500">
                                            <Mail className="h-4 w-4 mr-2 text-indigo-400" />
                                            <span>{user?.email}</span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsEditing(true)}
                                            className="mt-2 text-indigo-600 border-indigo-300 hover:bg-indigo-50"
                                        >
                                            Edit Profile
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <FriendRequestsDropdown>
                                <Button variant="outline" size="sm" className="relative border-indigo-300 hover:bg-indigo-50">
                                    <Bell className="h-4 w-4 mr-2 text-indigo-500" />
                                    Requests
                                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                                        3
                                    </span>
                                </Button>
                            </FriendRequestsDropdown>

                            <NotificationList />

                            <SendFriendRequest>
                                <Button variant="outline" size="sm" className="border-indigo-300 hover:bg-indigo-50">
                                    <UserPlus className="h-4 w-4 mr-2 text-indigo-500" />
                                    Add Friend
                                </Button>
                            </SendFriendRequest>

                            <Link href={"/home/settings"}>
                                <Button variant="outline" size="sm" className="border-indigo-300 hover:bg-indigo-50">
                                    Settings
                                </Button>
                            </Link>

                            <OpenChatButton />

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLogout}
                                className="text-red-500 border-red-200 hover:bg-red-50"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile Info */}
                    <div className="space-y-6 lg:col-span-1">
                        <Card className="rounded-2xl overflow-hidden shadow-sm border border-gray-200/50 backdrop-blur-sm bg-white/90">
                            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                                <div className="flex items-center space-x-3">
                                    <User className="h-5 w-5 text-indigo-500" />
                                    <CardTitle className="text-lg">Personal Information</CardTitle>
                                </div>
                                <CardDescription>Manage your profile details</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Username</h3>
                                        <p className="mt-1 text-sm font-medium">{user?.username}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</h3>
                                        <p className="mt-1 text-sm font-medium">{user?.email}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Account ID</h3>
                                        <p className="mt-1 text-sm font-medium">{user?.userId || 'N/A'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Friends Card */}
                        <Card className="rounded-2xl overflow-hidden shadow-sm border border-gray-200/50 backdrop-blur-sm bg-white/90">
                            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                                <CardTitle className="text-lg">Friends</CardTitle>
                                <CardDescription>123 friends</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-3 gap-3">
                                    {[1, 2, 3, 4, 5, 6].map((_, i) => (
                                        <div key={i} className="flex flex-col items-center">
                                            <Avatar className="h-16 w-16 mb-2 border-2 border-white shadow-sm">
                                                <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 10}`} />
                                                <AvatarFallback>F</AvatarFallback>
                                            </Avatar>
                                            <p className="text-xs font-medium text-center">Friend {i + 1}</p>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="ghost" className="w-full mt-4 text-indigo-600 hover:bg-indigo-50">
                                    View All Friends
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Posts */}
                    <div className="lg:col-span-2">
                        <Card className="rounded-2xl overflow-hidden shadow-sm border border-gray-200/50 backdrop-blur-sm bg-white/90">
                            <CardContent className="p-6">

                                <PostList />
                                <CreatePostForm />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;