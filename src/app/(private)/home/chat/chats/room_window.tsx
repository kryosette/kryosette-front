'use client'

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Plus, Lock, Users, MessageSquare, User, Search, MoreHorizontal, Settings } from "lucide-react"
import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useAuth } from "@/lib/auth-provider"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

const BACKEND_URL_CHAT = "http://localhost:8092";

interface Room {
    id: number
    name: string
    description: string
    createdAt: string
    createdBy: string
    lastMessage?: string
    lastMessageAt?: string
    unreadCount?: number
}

interface PrivateRoom {
    id: number
    name: string
    description: string | null
    createdAt: string
    createdBy: string
    type: string
    participantIds: string[]
    participantAvatars: string[]
    lastMessage?: string
    lastMessageAt?: string
    unreadCount?: number
}

export function RoomList() {
    const router = useRouter()
    const { token, user } = useAuth()
    const [rooms, setRooms] = useState<Room[]>([])
    const [privateRooms, setPrivateRooms] = useState<PrivateRoom[]>([])
    const [newRoomName, setNewRoomName] = useState("")
    const [newRoomDesc, setNewRoomDesc] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("group")
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        if (activeTab === 'group') {
            fetchRooms()
        } else {
            fetchPrivateRooms()
        }
    }, [activeTab])

    const fetchRooms = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get(`${BACKEND_URL_CHAT}/api/rooms`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setRooms(response.data)
        } catch (error) {
            console.error("Error fetching rooms:", error)
            toast.error("Failed to load group rooms")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchPrivateRooms = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get(`${BACKEND_URL_CHAT}/api/rooms/private`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setPrivateRooms(response.data)
        } catch (error) {
            console.error("Error fetching private rooms:", error)
            toast.error("Failed to load private rooms")
        } finally {
            setIsLoading(false)
        }
    }

    const createRoom = async () => {
        if (!newRoomName.trim()) return
        if (!newRoomDesc.trim()) return

        try {
            setIsLoading(true)
            const response = await axios.post(
                `${BACKEND_URL_CHAT}/api/rooms`,
                {
                    name: newRoomName,
                    description: newRoomDesc
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            toast.success("Room created successfully")
            await fetchRooms()
            setNewRoomName("")
            setNewRoomDesc("")
            setIsDialogOpen(false)
        } catch (error: any) {
            console.error("Error creating room:", error)
            toast.error(error.response?.data?.message || "Failed to create room")
        } finally {
            setIsLoading(false)
        }
    }

    const handleRoomSelect = (roomId: number, isPrivate: boolean = false) => {
        router.push(isPrivate ? `/home/room/private/${roomId}` : `/home/room/${roomId}`)
    }

    const handleViewProfile = (userId: string) => {
        router.push(`/home/users/${userId}`)
    }

    const filteredGroupRooms = rooms.filter(room =>
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const filteredPrivateRooms = privateRooms.filter(room =>
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.participantIds.some(id => id.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-full"
        >
            <Card className="h-full border-r rounded-none border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm">
                <CardHeader className="border-b border-gray-200/50 pb-3">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-semibold">
                            Chats
                        </CardTitle>
                        <div className="flex space-x-2">
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <motion.div whileHover={{ scale: 1.05 }}>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={cn(
                                                "h-8 w-8",
                                                activeTab !== 'group' && "hidden"
                                            )}
                                            aria-label="Create new room"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                </DialogTrigger>
                                <DialogContent className="border border-gray-200/50 bg-white/90 backdrop-blur-sm">
                                    <DialogHeader>
                                        <DialogTitle className="text-lg">Create New Room</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <Input
                                            placeholder="Room name"
                                            value={newRoomName}
                                            onChange={(e) => setNewRoomName(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && createRoom()}
                                            disabled={isLoading}
                                            className="bg-white/80"
                                        />

                                        <Input
                                            placeholder="Room desc"
                                            value={newRoomDesc}
                                            onChange={(e) => setNewRoomDesc(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && createRoom()}
                                            disabled={isLoading}
                                            className="bg-white/80"
                                        />
                                        <motion.div whileHover={{ scale: 1.02 }}>
                                            <Button
                                                onClick={createRoom}
                                                disabled={!newRoomName.trim() && !newRoomDesc.trim() || isLoading}
                                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                            >
                                                {isLoading ? "Creating..." : "Create Room"}
                                            </Button>
                                        </motion.div>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <motion.div whileHover={{ scale: 1.05 }}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="border border-gray-200/50 bg-white/90 backdrop-blur-sm">
                                    <DropdownMenuItem onClick={() => fetchRooms()}>
                                        Refresh
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Settings
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <div className="mt-3 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search chats..."
                            className="pl-9 bg-white/80"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <Tabs defaultValue="group" className="w-full mt-3">
                        <TabsList className="w-full bg-gray-100/50">
                            <TabsTrigger
                                value="group"
                                onClick={() => setActiveTab('group')}
                                className="flex items-center"
                            >
                                <Users className="h-4 w-4 mr-2" /> Group
                            </TabsTrigger>
                            <TabsTrigger
                                value="private"
                                onClick={() => setActiveTab('private')}
                                className="flex items-center"
                            >
                                <Lock className="h-4 w-4 mr-2" /> Private
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </CardHeader>

                <CardContent className="p-0 h-[calc(100%-180px)] overflow-y-auto">
                    <Tabs value={activeTab} className="w-full">
                        <TabsContent value="group" className="m-0">
                            {isLoading ? (
                                <div className="space-y-4 p-4">
                                    {[...Array(5)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-center space-x-3 p-2"
                                        >
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                            <div className="space-y-2 flex-1">
                                                <Skeleton className="h-4 w-3/4" />
                                                <Skeleton className="h-3 w-1/2" />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : filteredGroupRooms.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-8 text-center"
                                >
                                    <MessageSquare className="h-10 w-10 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500">
                                        {searchQuery ? "No matching group chats" : "No group chats available"}
                                    </p>
                                    {!searchQuery && (
                                        <Button
                                            variant="ghost"
                                            className="mt-2 text-indigo-600"
                                            onClick={() => setIsDialogOpen(true)}
                                        >
                                            Create your first room
                                        </Button>
                                    )}
                                </motion.div>
                            ) : (
                                <div className="space-y-1">
                                    {filteredGroupRooms.map((room) => (
                                        <motion.div
                                            key={room.id}
                                            whileHover={{ scale: 1.005 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div
                                                className="p-3 hover:bg-gray-100/50 rounded-lg cursor-pointer transition-colors border-b border-gray-200/50"
                                                onClick={() => handleRoomSelect(room.id)}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="relative">
                                                            <Avatar className="h-10 w-10 bg-indigo-100 text-indigo-600">
                                                                <AvatarFallback>
                                                                    {room.name.charAt(0).toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            {room.unreadCount && room.unreadCount > 0 && (
                                                                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500">
                                                                    {room.unreadCount}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center space-x-2">
                                                                <p className="font-medium truncate text-lg">{room.name}</p>
                                                                <Badge variant="secondary" className="text-xs">
                                                                    Group
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm text-gray-500 truncate">
                                                                <p className="font-medium text-gray-400 truncate">{room.description}</p>
                                                                {room.lastMessage || "No messages yet"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        {room.lastMessageAt ? formatDistanceToNow(new Date(room.lastMessageAt), { addSuffix: true }) : ""}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="private" className="m-0">
                            {isLoading ? (
                                <div className="space-y-4 p-4">
                                    {[...Array(5)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-center space-x-3 p-2"
                                        >
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                            <div className="space-y-2 flex-1">
                                                <Skeleton className="h-4 w-3/4" />
                                                <Skeleton className="h-3 w-1/2" />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : filteredPrivateRooms.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-8 text-center"
                                >
                                    <User className="h-10 w-10 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500">
                                        {searchQuery ? "No matching private chats" : "No private chats available"}
                                    </p>
                                </motion.div>
                            ) : (
                                <div className="space-y-1">
                                    {filteredPrivateRooms.map((room) => (
                                        <motion.div
                                            key={room.id}
                                            whileHover={{ scale: 1.005 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div
                                                className="p-3 hover:bg-gray-100/50 rounded-lg cursor-pointer transition-colors border-b border-gray-200/50"
                                                onClick={() => handleRoomSelect(room.id, true)}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="relative">
                                                            <Avatar className="h-10 w-10">
                                                                {room.participantAvatars?.length > 0 ? (
                                                                    <AvatarImage src={room.participantAvatars[0]} />
                                                                ) : (
                                                                    <AvatarFallback className="bg-pink-100 text-pink-600">
                                                                        {room.name.charAt(0).toUpperCase()}
                                                                    </AvatarFallback>
                                                                )}
                                                            </Avatar>
                                                            {room.unreadCount && room.unreadCount > 0 && (
                                                                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500">
                                                                    {room.unreadCount}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center space-x-2">
                                                                <p className="font-medium truncate">{room.name}</p>
                                                                <Badge variant="outline" className="text-xs">
                                                                    Private
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm text-gray-500 truncate">
                                                                {room.lastMessage || "No messages yet"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <div className="text-xs text-gray-400">
                                                            {room.lastMessageAt ? formatDistanceToNow(new Date(room.lastMessageAt), { addSuffix: true }) : ""}
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 text-gray-400 hover:text-indigo-600"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                const otherUserId = room.participantIds.find(id => id !== user?.userId)
                                                                if (otherUserId) {
                                                                    handleViewProfile(otherUserId)
                                                                }
                                                            }}
                                                        >
                                                            <User className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>

                <CardFooter className="border-t border-gray-200/50 p-3">
                    <div className="flex items-center space-x-3 w-full">
                        <Avatar className="h-8 w-8 border border-indigo-100">
                            <AvatarImage src={user?.avatar} />
                            <AvatarFallback className="bg-indigo-100 text-indigo-600">
                                {user?.username?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.username}</p>
                            <p className="text-xs text-gray-500 truncate">Online</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Settings className="h-4 w-4" />
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    )
}