'use client'

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, MessageSquare, Pin, PinOff, Reply } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import Replies from "./Replies";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-provider";
import { useComments } from "@/lib/hooks/use_comments";

interface CommentSectionProps {
    postId: number;
    postAuthorId: string;
}

/**
 * CommentSection component - Displays and manages comments for a post
 * @param {number} postId - The ID of the post
 * @param {string} postAuthorId - The ID of the post author
 * @returns {JSX.Element} The comment section UI
 */
export const CommentSection = ({ postId, postAuthorId }: CommentSectionProps) => {
    const [content, setContent] = useState('');
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [expandedReplies, setExpandedReplies] = useState<Record<number, boolean>>({});
    const queryClient = useQueryClient();
    // @ts-ignore
    const { user } = useAuth();

    // Comment management
    const {
        comments,
        error,
        addComment,
        addReply,
        isAddingComment,
        isAddingReply,
        togglePinComment,
        currentUserId
    } = useComments(postId);

    /**
     * Loads replies for a specific comment
     * @param {number} commentId - The ID of the comment to load replies for
     */
    const loadReplies = async (commentId: number) => {
        try {
            const res = await fetch(`http://localhost:8091/comments/${commentId}/replies`);
            const replies = await res.json();

            // Update only the replies for the specific comment
            queryClient.setQueryData(
                ['posts', postId, 'comments'],
                (old: any[]) => old.map(comment =>
                    comment.id === commentId
                        ? { ...comment, replies }
                        : comment
                )
            );
        } catch (err) {
            console.error('Error loading replies:', err);
            toast.error('Failed to load replies');
        }
    };

    /**
     * Handles submission of a new comment
     * @param {React.FormEvent} e - The form event
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            await addComment(content);
            setContent('');
            toast.success('Comment posted successfully');
        } catch (err) {
            console.error('Failed to create comment:', err);
            toast.error('Failed to post comment');
        }
    };

    /**
     * Toggles the pinned status of a comment
     * @param {number} commentId - The ID of the comment to pin/unpin
     */
    const handlePinComment = async (commentId: number) => {
        try {
            await togglePinComment(commentId);
            toast.success(comments.find(c => c.id === commentId)?.isPinned
                ? 'Comment unpinned'
                : 'Comment pinned');
        } catch (error) {
            console.error('Error toggling pin:', error);
            toast.error('Failed to update pin status');
        }
    };

    /**
     * Handles submission of a reply to a comment
     * @param {number} commentId - The ID of the comment to reply to
     */
    const handleReplySubmit = async (commentId: number) => {
        if (!replyContent.trim()) return;

        try {
            await addReply(commentId, replyContent);
            setReplyingTo(null);
            setReplyContent('');
            setExpandedReplies(prev => ({ ...prev, [commentId]: true }));
            toast.success('Reply posted successfully');
        } catch (err) {
            console.error('Failed to create reply:', err);
            toast.error('Failed to post reply');
        }
    };

    /**
     * Toggles the visibility of replies for a comment
     * @param {number} commentId - The ID of the comment
     */
    const toggleReplies = async (commentId: number) => {
        const comment = comments.find(c => c.id === commentId);
        if (!comment) return;

        if (comment.replies && comment.replies.length > 0) {
            setExpandedReplies(prev => ({
                ...prev,
                [commentId]: !prev[commentId]
            }));
        } else {
            await loadReplies(commentId);
            setExpandedReplies(prev => ({
                ...prev,
                [commentId]: true
            }));
        }
    };

    return (
        <div className="mt-4 border-t pt-4">
            {/* New Comment Form */}
            <form onSubmit={handleSubmit} className="mb-4">
                <Textarea
                    placeholder="Write a comment..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={2}
                    className="mb-2"
                />
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={isAddingComment || !content.trim()}
                    >
                        {isAddingComment ? 'Posting...' : 'Post Comment'}
                    </Button>
                </div>
            </form>

            {/* Error Display */}
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                    <p className="font-bold">Error</p>
                    <p>{error.message}</p>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
                {comments
                    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
                    .map(comment => (
                        <div key={comment.id} className="comment-thread">
                            {/* Main Comment */}
                            <div className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-gradient-to-r from-primary to-purple-500 text-white text-xs">
                                            {comment.username?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    {comment.repliesCount > 0 && (
                                        <button
                                            onClick={() => toggleReplies(comment.id)}
                                            className="mt-2 text-muted-foreground hover:text-primary transition-colors"
                                            aria-label={expandedReplies[comment.id] ? "Collapse replies" : "Expand replies"}
                                        >
                                            {expandedReplies[comment.id] ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            )}
                                        </button>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className={`bg-muted/50 rounded-lg p-3 ${comment.isPinned ? 'border-l-4 border-primary pl-3 bg-primary/10' : ''}`}>
                                        {/* Comment Header */}
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <Link href={`/home/users/${comment.username}`}>
                                                    <span className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                                                        {comment.username}
                                                    </span>
                                                </Link>
                                                <span className="text-muted-foreground text-xs">
                                                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                                </span>
                                                {comment.isPinned && (
                                                    <span className="text-xs text-primary font-medium flex items-center gap-1">
                                                        <Pin className="h-3 w-3" />
                                                        Pinned
                                                    </span>
                                                )}
                                            </div>

                                            {/* Pin Button (visible to comment author or post author) */}
                                            {user?.userId === comment.userId && (
                                                <button
                                                    onClick={() => handlePinComment(comment.id)}
                                                    className={`p-1 rounded-full hover:bg-muted transition-colors ${comment.isPinned ? 'text-primary' : 'text-muted-foreground'}`}
                                                    title={comment.isPinned ? "Unpin comment" : "Pin comment"}
                                                    aria-label={comment.isPinned ? "Unpin comment" : "Pin comment"}
                                                >
                                                    {comment.isPinned ? (
                                                        <PinOff className="h-4 w-4" />
                                                    ) : (
                                                        <Pin className="h-4 w-4" />
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        {/* Comment Content */}
                                        <p className="mt-1 text-sm">{comment.content}</p>

                                        {/* Comment Actions */}
                                        <div className="mt-2 flex items-center gap-3">
                                            <button
                                                onClick={() => {
                                                    setReplyingTo(replyingTo === comment.id ? null : comment.id);
                                                    setExpandedReplies(prev => ({ ...prev, [comment.id]: true }));
                                                }}
                                                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                                            >
                                                <Reply className="h-3 w-3" />
                                                Reply
                                            </button>

                                            {comment.repliesCount > 0 && (
                                                <button
                                                    onClick={() => toggleReplies(comment.id)}
                                                    className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                                                >
                                                    <MessageSquare className="h-3 w-3" />
                                                    {comment.repliesCount} {comment.repliesCount === 1 ? 'reply' : 'replies'}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Reply Form */}
                                    {replyingTo === comment.id && (
                                        <div className="mt-3 ml-8">
                                            <div className="flex gap-3">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-8 h-8 flex items-center justify-center">
                                                        <div className="w-4 h-4 border-l-2 border-b-2 border-muted-foreground/30 rounded-bl-lg"></div>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <Textarea
                                                        placeholder={`Reply to ${comment.username}...`}
                                                        value={replyContent}
                                                        onChange={(e) => setReplyContent(e.target.value)}
                                                        required
                                                        rows={2}
                                                        className="mb-2"
                                                    />
                                                    <div className="flex gap-2 justify-end">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setReplyingTo(null)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleReplySubmit(comment.id)}
                                                            disabled={isAddingReply || !replyContent.trim()}
                                                        >
                                                            {isAddingReply ? 'Posting...' : 'Post Reply'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Replies Component */}
                                    <Replies
                                        commentId={comment.id}
                                        userId={comment.username}
                                        expanded={expandedReplies[comment.id]}

                                    />
                                </div>
                            </div>
                        </div>
                    ))}
            </div>

            {/* Styling for comment threads */}
            <style jsx>{`
                .comment-thread {
                    position: relative;
                }
                .comment-thread::before {
                    content: "";
                    position: absolute;
                    left: 20px;
                    top: 40px;
                    bottom: 0;
                    width: 2px;
                    background: rgba(0,0,0,0.1);
                }
            `}</style>
        </div>
    );
};