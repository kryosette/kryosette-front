'use client'

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
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

const BACKEND_URL_CHAT = "http://localhost:8092";

interface Room {
    id: number
    name: string
    description: string
}

/**
 * RoomList Component
 * 
 * @component
 * @description
 * Displays a list of chat rooms with the ability to:
 * - View existing rooms
 * - Create new rooms
 * - Navigate to selected rooms
 * 
 * @requires
 * - User authentication token
 * - Backend API endpoint for rooms
 * 
 * @state {Room[]} rooms - List of available rooms
 * @state {string} newRoomName - Name for new room being created
 * @state {boolean} isDialogOpen - Controls new room dialog visibility
 */
export function RoomList() {
    const router = useRouter()
    // @ts-ignore
    const { token } = useAuth()
    const [rooms, setRooms] = useState<Room[]>([])
    const [newRoomName, setNewRoomName] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        fetchRooms()
    }, [])

    /**
     * Fetches the list of available rooms from the server
     * @async
     */
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
            toast.error("Failed to load rooms")
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * Creates a new chat room
     * @async
     */
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

            if (response.status === 200 || response.status === 201) {
                toast.success("Room created successfully")
                await fetchRooms()
                setNewRoomName("")
                setIsDialogOpen(false)
            } else {
                throw new Error(`Unexpected status code: ${response.status}`)
            }
        } catch (error: any) {
            console.error("Error creating room:", error)
            toast.error(error.response?.data?.message || "Failed to create room")
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * Handles room selection navigation
     * @param {number} roomId - ID of the selected room
     */
    const handleRoomSelect = (roomId: number) => {
        router.push(`/home/room/${roomId}`)
    }

    return (
        <Card className="w-80 border-r rounded-none">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    Chat Rooms
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
                                    onKeyDown={(e) => e.key === "Enter" && createRoom()}
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
                </CardTitle>
            </CardHeader>
            <div className="p-4 space-y-2">
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
                        No rooms available
                    </p>
                ) : (
                    rooms.map((room) => (
                        <div
                            key={room.id}
                            className="p-2 hover:bg-muted rounded cursor-pointer transition-colors"
                            onClick={() => handleRoomSelect(room.id)}
                            aria-label={`Select room ${room.name}`}
                        >
                            <p className="font-medium">{room.name}</p>
                            {room.description && (
                                <p className="text-sm text-muted-foreground truncate">
                                    {room.description}
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </Card>
    )
}