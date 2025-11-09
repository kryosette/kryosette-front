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
import { Sparkles, MessageSquare, Trash2, MoreHorizontal, Eye } from 'lucide-react'
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
                className="h-8 w-8 rounded-full border-2 border-black/20 border-t-black/80"
            />
        </div>
    )

    if (error) return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-black/10 text-black p-4 rounded-2xl mb-6"
            role="alert"
        >
            <p className="font-medium">Error loading posts</p>
            <p className="text-sm opacity-80 mt-1">{error}</p>
        </motion.div>
    )

    return (
        <div className="max-w-3xl mx-auto relative">
            {/* Header with post creation */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center -mb-3"
            >

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
                        whileHover={{ y: -2 }}
                        className="rounded-2xl overflow-hidden"
                        onViewportEnter={() => handleRecordView(post.id)}
                    >
                        <Card className="border border-black/10 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                            <CardContent className="p-6">
                                {/* Post header */}
                                <div className="flex justify-between items-start mb-4 gap-4">
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="h-9 w-9 border border-black/10 bg-white">
                                            <AvatarFallback className="bg-white text-black/80 text-sm font-normal border border-black/10">
                                                {post.authorName.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <Link
                                                href={`/home/users/${post.authorName}`}
                                                className="text-sm font-normal text-black hover:text-black/80 transition-colors"
                                            >
                                                {post.authorName}
                                            </Link>
                                            <p className="text-xs text-black/50 font-light">
                                                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-black/40">

                                            <ViewCounter postId={post.id} initialCount={post.viewsCount || 0} />
                                        </div>
                                        {user?.userId === post.authorName && (
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleDeleteClick(post.id)}
                                                className="text-black/30 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-black/5"
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
                                    <h2 className="text-lg font-normal text-black mt-1 mb-3 leading-relaxed">
                                        {post.title}
                                    </h2>
                                )}



                                <div className="prose prose-sm max-w-none mb-4">
                                    <ReactMarkdown
                                        rehypePlugins={[rehypeHighlight]}
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            a: ({ href, children }) => (
                                                <Link
                                                    href={href || '#'}
                                                    className="text-blue-600 hover:text-blue-800 hover:underline transition-colors font-normal"
                                                    target={href?.startsWith('http') ? '_blank' : undefined}
                                                    rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                                                >
                                                    {children}
                                                </Link>
                                            ),
                                            code: ({ node, inline, className, children, ...props }) => {
                                                const match = /language-(\w+)/.exec(className || '')
                                                return !inline && match ? (
                                                    <div className="relative rounded-xl overflow-hidden mb-4 border border-black/10 bg-white">
                                                        <div className="absolute right-3 top-2 text-xs text-black/40 font-light">
                                                            {match[1]}
                                                        </div>
                                                        <code
                                                            className={className}
                                                            style={{
                                                                display: 'block',
                                                                padding: '1.25rem 1rem',
                                                                overflowX: 'auto',
                                                                backgroundColor: 'white'
                                                            }}
                                                            {...props}
                                                        >
                                                            {children}
                                                        </code>
                                                    </div>
                                                ) : (
                                                    <code
                                                        className="bg-black/5 px-2 py-1 rounded-lg text-sm font-mono text-black/80 font-normal border border-black/10"
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

                                {post.poll && (
                                    <PollComponent
                                        poll={post.poll}
                                        onVote={(optionIds) => votePoll({ postId: post.id, optionIds })}
                                        isVoting={isVoting}
                                        currentUserId={user?.userId}
                                    />
                                )}

                                {(post.poll && post.hashtags && post.hashtags.length > 0) && (
                                    <div className="mb-4" />
                                )}

                                {/* Hashtags */}
                                {post.hashtags && post.hashtags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {post.hashtags.map((tag, index) => (
                                            <motion.div
                                                key={index}
                                                whileHover={{ y: -1 }}
                                            >
                                                <HashtagLink
                                                    tag={tag}
                                                    className="px-3 py-1 bg-black/5 rounded-full text-sm text-black/70 hover:bg-black/10 hover:text-black/90 transition-colors font-normal border border-black/10"
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                )}

                                {/* Post actions */}
                                <div className="flex items-center justify-between border-t border-black/10 pt-4">
                                    <div className="flex items-center space-x-4">
                                        <LikeButton postId={post.id} />

                                        <button
                                            className="flex items-center space-x-2 text-black/50 hover:text-black/80 transition-colors p-1.5 rounded-lg hover:bg-black/5 border border-transparent hover:border-black/10 text-sm font-normal"
                                            onClick={() => toggleComments(post.id)}
                                            aria-expanded={expandedComments[post.id]}
                                            aria-controls={`comments-${post.id}`}
                                        >
                                            <MessageSquare className="h-3.5 w-3.5" />
                                            <span>
                                                {expandedComments[post.id] ? 'Hide' : 'Comments'}
                                            </span>
                                        </button>
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
                                            className="mt-4 pt-4 border-t border-black/10 overflow-hidden"
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
            {isFetchingNextPage && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center items-center my-8"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-6 w-6 rounded-full border-2 border-black/20 border-t-black/80"
                    />
                </motion.div>
            )}

            {/* End of posts */}
            {!hasNextPage && posts.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-black/40 my-8 py-4 border-t border-black/10 font-light text-sm"
                >
                    You've reached the end of posts
                </motion.div>
            )}

            {/* Empty state */}
            {!isLoading && posts.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 text-black/50 font-light"
                >
                    No posts found. Be the first to create one!
                </motion.div>
            )}
        </div>
    )
}