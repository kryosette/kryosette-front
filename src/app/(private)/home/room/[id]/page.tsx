'use client'

import { useAuth } from "@/lib/auth-provider";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import axios from "axios";
import RoomChat from "../../chat/chats/room_list";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Room {
    id: number;
    name: string;
    description: string;
}

export default function RoomPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    // @ts-ignore
    const { token } = useAuth();
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // @ts-ignore
    const { id } = use(params);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8092/api/rooms/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setRoom(response.data);
            } catch (err) {
                console.error("Ошибка при получении комнаты:", err);
                setError("Не удалось загрузить комнату");
                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    router.push("/not-found");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRoom();
    }, [id, token, router]);

    if (loading) return (
        <div className="p-4 space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-[500px] w-full" />
        </div>
    );

    if (error) return (
        <Card className="m-4 border-destructive">
            <CardHeader>
                <CardTitle className="text-destructive">Ошибка</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{error}</p>
                <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => router.push("/")}
                >
                    На главную
                </Button>
            </CardContent>
        </Card>
    );

    return (
        <div className="flex flex-col h-screen">
            {/* Шапка комнаты */}
            <div className="flex items-center justify-between p-4 border-b">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>

                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold">{room?.name}</h1>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Информация</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">Покинуть</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Основное содержимое */}
            <div className="flex-1 overflow-hidden p-4">
                {room?.description && (
                    <p className="mb-4 text-muted-foreground">{room.description}</p>
                )}

                <div className="h-full">
                    <RoomChat roomId={id} />
                </div>
            </div>
        </div>
    );
}