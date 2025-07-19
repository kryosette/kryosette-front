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
import { useRouter } from "next/navigation";

interface Room {
    id: number
    name: string
    description: string
}

export function RoomList() {
    const router = useRouter();
    const { token } = useAuth();
    const [rooms, setRooms] = useState<Room[]>([])
    const [newRoomName, setNewRoomName] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    useEffect(() => {
        fetchRooms()
    }, [])

    const fetchRooms = async () => {
        try {
            const response = await axios.get("http://localhost:8092/api/rooms");
            console.log("Данные с сервера:", response.data); // Смотрим, что пришло!
            setRooms(response.data);
        } catch (error) {
            console.error("Ошибка при получении комнат:", error);
            // TODO: Показать сообщение об ошибке пользователю
        }
    };

    const createRoom = async () => {
        if (!newRoomName.trim()) return;

        try {
            const response = await axios.post("http://localhost:8092/api/rooms", {
                name: newRoomName,
                description: ""
            },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`  // ← Вот это обязательно!
                    }
                });

            if (response.status === 200 || response.status === 201) { // Проверяем код статуса
                fetchRooms();
                setNewRoomName("");
                setIsDialogOpen(false);
            } else {
                console.error("Не удалось создать комнату. Код статуса:", response.status);
                // TODO: Показать сообщение об ошибке пользователю
            }
        } catch (error: any) { // Important type here!
            console.error("Ошибка при создании комнаты:", error);
            // TODO: Показать сообщение об ошибке пользователю
        }
    };

    const handleRoomSelect = (roomId: number) => {
        router.push(`/home/room/${roomId}`); // Переход на страницу комнаты
        // Для React Router: navigate(`/room/${roomId}`);
    };

    return (
        <Card className="w-80 border-r rounded-none">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    Комнаты
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Plus className="cursor-pointer hover:text-primary" />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Создать новую комнату</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <Input
                                    placeholder="Название комнаты"
                                    value={newRoomName}
                                    onChange={(e) => setNewRoomName(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && createRoom()}
                                />
                                <Button
                                    onClick={createRoom}
                                    disabled={!newRoomName.trim()}
                                >
                                    Создать
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardTitle>
            </CardHeader>
            <div className="p-4 space-y-2">
                {rooms?.map((room) => (
                    <div
                        key={room.id}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer transition-colors"
                        onClick={() => handleRoomSelect(room.id)} // ← Теперь клик ведёт в комнату
                    >
                        <p className="font-medium">{room.name}</p>
                        {room.description && (
                            <p className="text-sm text-muted-foreground">{room.description}</p>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    )
}