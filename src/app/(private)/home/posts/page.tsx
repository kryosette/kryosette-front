'use client'

import CreatePostForm from "./create_post/page"
import { LikeButton } from "@/components/posts/like/like_button"
import { useState, useEffect } from "react"
import { CommentSection } from "./create_comment/comment_section"
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
import { usePosts } from "@/lib/hooks/use_posts"
import usePostViews from "@/lib/hooks/views/use_post_views"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sparkles, MessageSquare, Trash2, MoreHorizontal } from 'lucide-react'
import { PollComponent } from "./poll/poll"
import { usePostPolls } from "@/lib/hooks/use_posts_polls"

const BASE_BACKEND_URL = "http://localhost:8091/posts"

export default function PostList() {
    const {
        posts,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        deletePost,
        isDeleting,
        votePoll,
        isVoting
    } = usePosts()

    const {
        getPoll
    } = usePostPolls()
    const { token, user } = useAuth();
    const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({})
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [postToDelete, setPostToDelete] = useState<number | null>(null)
    const isExpired = posts.expiresAt && new Date(posts.expiresAt) < new Date();

    if (isExpired) return null;

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop + 100 >=
                document.documentElement.offsetHeight &&
                hasNextPage &&
                !isFetchingNextPage
            ) {
                fetchNextPage()
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    const toggleComments = (postId: number) => {
        setExpandedComments(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }))
    }

    const handleRecordView = async (postId: string) => {
        try {
            await axios.post(`${BASE_BACKEND_URL}/${postId}/view`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error('Failed to record view:', error);
        }
    };

    const { recordView } = usePostViews(handleRecordView);

    const handleDeleteClick = (postId: number) => {
        setPostToDelete(postId)
        setConfirmOpen(true)
    }

    const handleConfirmDelete = () => {
        if (postToDelete) {
            deletePost(postToDelete)
        }
        setConfirmOpen(false)
    }

    if (isLoading && posts.length === 0) return (
        <div className="flex justify-center items-center h-64">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-12 w-12 rounded-full border-2 border-indigo-500 border-t-transparent"
            />
        </div>
    )

    if (error) return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6"
            role="alert"
        >
            <p className="font-bold">Error loading posts</p>
            <p>{error}</p>
        </motion.div>
    )

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 relative">
            {/* Header with post creation */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center mb-8"
            >
                <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-indigo-500" />
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Community Feed
                    </h1>
                </div>

            </motion.div>

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

            {/* Posts list */}
            <div className="space-y-6">

                {posts.map(post => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.005 }}
                        className="rounded-xl overflow-hidden"
                        onViewportEnter={() => handleRecordView(post.id)}
                    >
                        <Card className="border border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
                            {/* <Link href={`/home/posts/${post.id}`} > */}
                            <CardContent className="p-6">
                                {/* Post header */}
                                <div className="flex justify-between items-start mb-4 gap-4">
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="h-10 w-10 border border-indigo-100">
                                            {/* <AvatarImage src={`https://i.pravatar.cc/150?u=${post.authorName}`} /> */}
                                            <AvatarFallback className="bg-indigo-100 text-indigo-600">
                                                {post.authorName.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <Link
                                                href={`/home/users/${post.authorName}`}
                                                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors hover:underline"
                                            >
                                                {post.authorName}
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
                                                onClick={() => handleDeleteClick(post.id)}
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
                                        onVote={(optionIds) => votePoll({ postId: post.id, optionIds })}
                                        isVoting={isVoting}
                                        currentUserId={user?.userId}
                                    />
                                )}

                                <div className="prose prose-sm max-w-none mb-4">
                                    <ReactMarkdown
                                        rehypePlugins={[rehypeHighlight]}
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            // Стили для ссылок
                                            a: ({ href, children }) => (
                                                <Link
                                                    href={href || '#'}
                                                    className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                                    target={href?.startsWith('http') ? '_blank' : undefined}
                                                    rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                                                >
                                                    {children}
                                                </Link>
                                            ),
                                            code: ({ node, inline, className, children, ...props }) => {
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
                                        <LikeButton postId={post.id} />

                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600 transition-colors"
                                            onClick={() => toggleComments(post.id)}
                                            aria-expanded={expandedComments[post.id]}
                                            aria-controls={`comments-${post.id}`}
                                        >
                                            <MessageSquare className="h-5 w-5" />
                                            <span className="text-sm">
                                                {expandedComments[post.id] ? 'Hide' : 'Comments'}
                                            </span>
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Comment section */}
                                <AnimatePresence>
                                    {expandedComments[post.id] && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="mt-4 pt-4 border-t border-gray-200/50 overflow-hidden"
                                            id={`comments-${post.id}`}
                                        >
                                            <CommentSection postId={post.id} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Loading indicator */}
            {
                isFetchingNextPage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center items-center my-8"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent"
                        />
                    </motion.div>
                )
            }

            {/* End of posts */}
            {
                !hasNextPage && posts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-gray-500 my-8 py-4 border-t border-gray-200/50"
                    >
                        You've reached the end of posts
                    </motion.div>
                )
            }

            {/* Empty state */}
            {
                !isLoading && posts.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 text-gray-500"
                    >
                        No posts found. Be the first to create one!
                    </motion.div>
                )
            }

        </div >

    )
}