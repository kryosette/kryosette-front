'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Plus, Lock, Users } from "lucide-react"
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

const BACKEND_URL_CHAT = "http://localhost:8092";

interface Room {
    id: number
    name: string
    description: string
    createdAt: string
    createdBy: string
}

interface PrivateRoom {
    id: number
    name: string
    description: string | null
    createdAt: string
    createdBy: string
    type: string
    participantIds: string[]
}

export function RoomList() {
    const router = useRouter()
    const { token } = useAuth()
    const [rooms, setRooms] = useState<Room[]>([])
    const [privateRooms, setPrivateRooms] = useState<PrivateRoom[]>([])
    const [newRoomName, setNewRoomName] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("group")

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

        try {
            setIsLoading(true)
            const response = await axios.post(
                `${BACKEND_URL_CHAT}/api/rooms`,
                {
                    name: newRoomName,
                    description: ""
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }

    return (
        <Card className="w-80 border-r rounded-none">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <Tabs defaultValue="group" className="w-full">
                        <div className="flex justify-between items-center">
                            <TabsList>
                                <TabsTrigger value="group" onClick={() => setActiveTab('group')}>
                                    <Users className="h-4 w-4 mr-2" /> Group
                                </TabsTrigger>
                                <TabsTrigger value="private" onClick={() => setActiveTab('private')}>
                                    <Lock className="h-4 w-4 mr-2" /> Private
                                </TabsTrigger>
                            </TabsList>
                            {activeTab === 'group' && (
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            aria-label="Create new room"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Create New Room</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <Input
                                                placeholder="Room name"
                                                value={newRoomName}
                                                onChange={(e) => setNewRoomName(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && createRoom()}
                                                disabled={isLoading}
                                            />
                                            <Button
                                                onClick={createRoom}
                                                disabled={!newRoomName.trim() || isLoading}
                                            >
                                                {isLoading ? "Creating..." : "Create Room"}
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    </Tabs>
                </CardTitle>
            </CardHeader>

            <CardContent>
                <Tabs value={activeTab} className="w-full">
                    <TabsContent value="group">
                        {isLoading ? (
                            <div className="space-y-2">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="p-2 space-y-2">
                                        <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
                                        <div className="h-3 w-1/2 bg-muted rounded animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        ) : rooms.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                No group rooms available
                            </p>
                        ) : (
                            rooms.map((room) => (
                                <div
                                    key={room.id}
                                    className="p-2 hover:bg-muted rounded cursor-pointer transition-colors"
                                    onClick={() => handleRoomSelect(room.id)}
                                >
                                    <div className="flex justify-between items-center">
                                        <p className="font-medium">{room.name}</p>
                                        <Badge variant="secondary" className="text-xs">
                                            Group
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Created by: {room.createdBy}</span>
                                        <span>{formatDate(room.createdAt)}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </TabsContent>

                    <TabsContent value="private">
                        {isLoading ? (
                            <div className="space-y-2">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="p-2 space-y-2">
                                        <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
                                        <div className="h-3 w-1/2 bg-muted rounded animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        ) : privateRooms.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                No private chats available
                            </p>
                        ) : (
                            privateRooms.map((room) => (
                                <div
                                    key={room.id}
                                    className="p-2 hover:bg-muted rounded cursor-pointer transition-colors"
                                    onClick={() => handleRoomSelect(room.id, true)}
                                >
                                    <div className="flex justify-between items-center">
                                        <p className="font-medium">{room.name}</p>
                                        <Badge variant="outline" className="text-xs">
                                            Private
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>
                                            {room.participantIds.length} participant
                                            {room.participantIds.length !== 1 ? 's' : ''}
                                        </span>
                                        <span>{formatDate(room.createdAt)}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}