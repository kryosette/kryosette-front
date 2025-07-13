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
    userId?: number  // Added optional userId for better typing
}

interface RepliesProps {
    commentId: number
    userId: number | string  // Made more flexible to handle string IDs
    expanded?: boolean      // Added prop to control expansion
    onReply?: (parentId: number, username: string) => void  // Added callback for reply action
}

/**
 * Replies component - Displays replies to a comment
 * @param {number} commentId - The ID of the parent comment
 * @param {number|string} userId - The ID of the current user
 * @param {boolean} [expanded] - Whether replies should be initially expanded
 * @param {function} [onReply] - Callback function when reply is clicked
 * @returns {JSX.Element} The replies list UI
 */
export default function Replies({
    commentId,
    userId,
    expanded = true,
    onReply
}: RepliesProps) {
    // State management
    const [replies, setReplies] = useState<ReplyData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isExpanded, setIsExpanded] = useState(expanded)

    /**
     * Fetches replies for the parent comment
     */
    const fetchReplies = async () => {
        setLoading(true)
        setError('')

        try {
            const response = await axios.get<ReplyData[]>(
                `http://localhost:8091/comments/${commentId}/replies`
            )
            setReplies(response.data)
        } catch (err) {
            console.error('Error fetching replies:', err)
            setError('Failed to load replies. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    // Fetch replies when component mounts or commentId changes
    useEffect(() => {
        if (isExpanded) {
            fetchReplies()
        }
    }, [commentId, isExpanded])

    /**
     * Handles reply button click
     * @param {number} parentId - The ID of the comment being replied to
     * @param {string} username - The username of the comment author
     */
    const handleReplyClick = (parentId: number, username: string) => {
        if (onReply) {
            onReply(parentId, username)
        }
    }

    // Loading state
    if (loading && isExpanded) return (
        <div className="ml-8 mt-2 text-sm text-muted-foreground">
            Loading replies...
        </div>
    )

    // Error state
    if (error && isExpanded) return (
        <div className="ml-8 mt-2 text-sm text-red-500">
            {error}
            <button
                onClick={fetchReplies}
                className="ml-2 text-primary hover:underline"
            >
                Retry
            </button>
        </div>
    )

    // Empty state
    if (!loading && replies.length === 0 && isExpanded) return (
        <div className="ml-8 mt-2 text-sm text-muted-foreground">
            No replies yet
        </div>
    )

    // Collapsed state
    if (!isExpanded) return (
        <button
            onClick={() => setIsExpanded(true)}
            className="ml-8 mt-2 text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
        >
            <MessageSquare className="h-3 w-3" />
            Show replies ({replies.length})
        </button>
    )

    // Expanded with replies state
    return (
        <div className="ml-8 mt-2 space-y-3">
            {replies.map(reply => (
                <div key={reply.id} className="flex gap-3 reply-item">
                    {/* Visual connection line and avatar */}
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

                    {/* Reply content */}
                    <div className="flex-1">
                        <div className="bg-muted/30 rounded-lg p-3">
                            {/* Reply header */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <Link href={`/home/users/${reply.username}`}>
                                    <span className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                                        {reply.username}
                                    </span>
                                </Link>

                                {reply.userId && (
                                    <span className="text-xs text-muted-foreground">
                                        → {userId}
                                    </span>
                                )}

                                <span className="text-muted-foreground text-xs">
                                    {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                                </span>
                            </div>

                            {/* Reply text */}
                            <p className="mt-1 text-sm">{reply.content}</p>

                            {/* Reply actions */}
                            <div className="mt-2 flex items-center gap-3">
                                <button
                                    onClick={() => handleReplyClick(reply.id, reply.username)}
                                    className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                                    aria-label={`Reply to ${reply.username}`}
                                >
                                    <Reply className="h-3 w-3" />
                                    Reply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Collapse button when expanded */}
            {replies.length > 0 && (
                <button
                    onClick={() => setIsExpanded(false)}
                    className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 ml-11"
                >
                    <MessageSquare className="h-3 w-3" />
                    Hide replies
                </button>
            )}
        </div>
    )
}