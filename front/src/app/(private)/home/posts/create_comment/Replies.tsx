'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { formatDistanceToNow } from 'date-fns'
import { Reply, MessageSquare } from 'lucide-react'
import Link from 'next/link'

interface ReplyData {
    id: number
    content: string
    username: string
    createdAt: string
}

export default function Replies({ commentId, userId }: { commentId: number, userId: number }) {
    const [replies, setReplies] = useState<ReplyData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchReplies = async () => {
            try {
                const response = await axios.get(`http://localhost:8091/comments/${commentId}/replies`)
                setReplies(response.data)
            } catch (err) {
                setError('Failed to load replies')
                console.error('Error:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchReplies()
    }, [commentId, userId])

    if (loading) return (
        <div className="ml-8 mt-2 text-sm text-muted-foreground">
            Loading replies...
        </div>
    )

    if (error) return (
        <div className="ml-8 mt-2 text-sm text-red-500">
            {error}
        </div>
    )

    return (
        <div className="ml-8 mt-2 space-y-3">
            {replies.map(reply => (
                <div key={reply.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 flex items-center justify-center">
                            <div className="w-4 h-4 border-l-2 border-b-2 border-muted-foreground/30 rounded-bl-lg"></div>
                        </div>
                        <div className="h-8 w-8 flex items-center justify-center -mt-1">
                            <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center text-xs">
                                {reply.username.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="bg-muted/30 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                                <Link href={`/home/users/${reply.username}`}>
                                    <span className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                                        {reply.username}
                                    </span>
                                </Link>

                                <span className="text-xs text-muted-foreground">
                                    → {userId}
                                </span>

                                <span className="text-muted-foreground text-xs">
                                    {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                                </span>
                            </div>
                            <p className="mt-1 text-sm">{reply.content}</p>
                            <div className="mt-2 flex items-center gap-3">
                                <button className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
                                    <Reply className="h-3 w-3" />
                                    Reply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}