// components/notifications/NotificationList.tsx
'use client'

import { Bell, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '@/lib/auth-provider'

interface Notification {
    id: string
    type: string
    message: string
    isRead: boolean
    createdAt: string
    sender: {
        id: string
        username: string
        avatarUrl?: string
    }
}

export function NotificationList() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const { token } = useAuth()

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('http://localhost:8088/api/v1/notifications', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (response.ok) {
                    const data = await response.json()
                    setNotifications(data.content)
                    setUnreadCount(data.unreadCount)
                }
            } catch (error) {
                console.error('Error fetching notifications:', error)
            }
        }

        fetchNotifications()
        const interval = setInterval(fetchNotifications, 30000) // Обновление каждые 30 сек

        return () => clearInterval(interval)
    }, [token])

    const markAsRead = async (id: string) => {
        try {
            await fetch(`http://localhost:8088/api/notifications/${id}/read`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, isRead: true } : n
            ))
            setUnreadCount(prev => prev - 1)
        } catch (error) {
            console.error('Error marking notification as read:', error)
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="relative border-indigo-300 hover:bg-indigo-50">
                    <Bell className="h-4 w-4 mr-2 text-indigo-500" />
                    Notifications
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                    <Button variant="ghost" size="sm">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No notifications yet
                        </div>
                    ) : (
                        notifications.map(notification => (
                            <div
                                key={notification.id}
                                className={`p-4 border-b hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50' : ''}`}
                                onClick={() => markAsRead(notification.id)}
                            >
                                <div className="flex items-start gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={notification.sender.avatarUrl} />
                                        <AvatarFallback>
                                            {notification.sender.username.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{notification.message}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                    {!notification.isRead && (
                                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-1" />
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="p-2 border-t text-center">
                    <Button variant="ghost" size="sm" className="text-indigo-600">
                        View all notifications
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}