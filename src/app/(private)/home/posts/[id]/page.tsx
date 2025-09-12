'use client'

import { LikeButton } from "@/components/posts/like/like_button"
import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import 'highlight.js/styles/github-dark.css'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth-provider'
import { ConfirmDialog } from "@/components/posts/confirm-dialog"
import { ViewCounter } from "@/components/posts/views/view_counter"
import axios from "axios"
import { HashtagLink } from "@/components/posts/hashtags/hashtag_link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Trash2, MoreHorizontal, ArrowLeft } from 'lucide-react'
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { usePostPolls } from "@/lib/hooks/use_posts_polls"
import { PollComponent } from "../poll/poll"
import { CommentSection } from "../create_comment/comment_section"

const BASE_BACKEND_URL = "http://localhost:8091/posts"

interface Post {
    id: number;
    title: string;
    content: string;
    authorName: string;
    createdAt: string;
    likesCount: number | null;
    isLiked: boolean | null;
    viewsCount: number;
    comments: any[] | null;
    hashtags: string[];
    poll: any | null;
    expiresAt: string | null;
    expired: boolean;
}

export default function PostDetail({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { token, user } = useAuth();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedComments, setExpandedComments] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isVoting, setIsVoting] = useState(false);

    const { getPoll } = usePostPolls();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(
                    `${BASE_BACKEND_URL}/${params.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setPost(response.data);
            } catch (err) {
                console.error("Error fetching post:", err);
                setError("Failed to load post");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchPost();
        }
    }, [params.id, token]);

    const handleRecordView = async () => {
        if (!post) return;
        try {
            await axios.post(`${BASE_BACKEND_URL}/${post.id}/view`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error('Failed to record view:', error);
        }
    };

    const toggleComments = () => {
        setExpandedComments(prev => !prev);
    };

    const handleDeleteClick = () => {
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!post) return;
        setIsDeleting(true);
        try {
            await axios.delete(`${BASE_BACKEND_URL}/${post.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            router.push('/home');
        } catch (error) {
            console.error('Failed to delete post:', error);
        } finally {
            setIsDeleting(false);
            setConfirmOpen(false);
        }
    };

    const votePoll = async (optionIds: number[]) => {
        if (!post || !post.poll) return;
        setIsVoting(true);
        try {
            await axios.post(`${BASE_BACKEND_URL}/${post.id}/poll/vote`, { optionIds }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Refresh poll data
            const updatedPoll = await getPoll(post.id);
            setPost(prev => prev ? { ...prev, poll: updatedPoll } : null);
        } catch (error) {
            console.error('Failed to vote:', error);
        } finally {
            setIsVoting(false);
        }
    };

    if (loading) return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="flex items-center gap-3 mb-6">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <Skeleton className="h-8 w-1/3" />
            </div>
            <div className="space-y-4">
                <Card className="border border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4 gap-4">
                            <div className="flex items-center space-x-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                            <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-6 w-3/4 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-5/6 mb-2" />
                        <Skeleton className="h-4 w-4/6 mb-4" />
                        <div className="flex gap-2">
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-8 w-24" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    if (error) return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto px-4 py-6"
        >
            <div className="flex items-center gap-3 mb-6">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-bold">Error</h1>
            </div>
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                <p className="font-bold">Error loading post</p>
                <p>{error}</p>
            </div>
        </motion.div>
    );

    if (!post) return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="flex items-center gap-3 mb-6">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-bold">Post not found</h1>
            </div>
            <div className="text-center py-12 text-gray-500">
                The post you're looking for doesn't exist.
            </div>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 relative">
            {/* Back button and title */}
            <div className="flex items-center gap-3 mb-6">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Post
                </h1>
            </div>

            {/* Delete confirmation dialog */}
            <ConfirmDialog
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Post"
                message="Are you sure you want to delete this post? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={isDeleting}
            />

            {/* Post card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl overflow-hidden"
                onViewportEnter={handleRecordView}
            >
                <Card className="border border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-6">
                        {/* Post header */}
                        <div className="flex justify-between items-start mb-4 gap-4">
                            <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10 border border-indigo-100">
                                    <AvatarFallback className="bg-indigo-100 text-indigo-600">
                                        {post.authorName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <Link href={`/home/users/${post.authorName}`}>
                                        <span className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                                            {post.authorName}
                                        </span>
                                    </Link>
                                    <p className="text-xs text-gray-500">
                                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <ViewCounter postId={post.id} initialCount={post.viewsCount || 0} />
                                {user?.userId === post.authorName && (
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleDeleteClick}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                        disabled={isDeleting}
                                        aria-label="Delete post"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </motion.button>
                                )}
                            </div>
                        </div>

                        {/* Post content */}
                        {post.title && (
                            <h2 className="text-xl font-bold text-gray-800 mt-1 mb-3">
                                {post.title}
                            </h2>
                        )}

                        {post.poll && (
                            <PollComponent
                                poll={post.poll}
                                onVote={votePoll}
                                isVoting={isVoting}
                                currentUserId={user?.userId}
                            />
                        )}

                        <div className="prose prose-sm max-w-none mb-4">
                            <ReactMarkdown
                                rehypePlugins={[rehypeHighlight]}
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code({ node, inline, className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || '')
                                        return !inline && match ? (
                                            <div className="relative rounded-lg overflow-hidden mb-4">
                                                <div className="absolute right-3 top-2 text-xs text-gray-400">
                                                    {match[1]}
                                                </div>
                                                <code
                                                    className={className}
                                                    style={{
                                                        display: 'block',
                                                        padding: '1.25rem 1rem',
                                                        overflowX: 'auto',
                                                        backgroundColor: '#0d1117'
                                                    }}
                                                    {...props}
                                                >
                                                    {children}
                                                </code>
                                            </div>
                                        ) : (
                                            <code
                                                className="bg-gray-100 px-2 py-1 rounded-md text-sm font-mono text-indigo-600"
                                                {...props}
                                            >
                                                {children}
                                            </code>
                                        )
                                    }
                                }}
                            >
                                {post.content}
                            </ReactMarkdown>
                        </div>

                        {/* Hashtags */}
                        {post.hashtags && post.hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {post.hashtags.map((tag, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ y: -2 }}
                                    >
                                        <HashtagLink
                                            tag={tag}
                                            className="px-3 py-1 bg-gray-100/70 rounded-full text-sm hover:bg-gray-200/70 transition-colors"
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Post actions */}
                        <div className="flex items-center justify-between border-t border-gray-200/50 pt-4">
                            <div className="flex items-center space-x-4">
                                <LikeButton postId={post.id} initialLikes={post.likesCount || 0} initialIsLiked={post.isLiked || false} />

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600 transition-colors"
                                    onClick={toggleComments}
                                    aria-expanded={expandedComments}
                                >
                                    <MessageSquare className="h-5 w-5" />
                                    <span className="text-sm">
                                        {expandedComments ? 'Hide' : 'Comments'}
                                    </span>
                                </motion.button>
                            </div>
                        </div>

                        {/* Comment section */}
                        <AnimatePresence>
                            {expandedComments && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="mt-4 pt-4 border-t border-gray-200/50 overflow-hidden"
                                >
                                    <CommentSection postId={post.id} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}