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
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-provider'
import { ConfirmDialog } from "@/components/posts/confirm-dialog"
import { ViewCounter } from "@/components/posts/views/view_counter"
import axios from "axios"
import { HashtagLink } from "@/components/posts/hashtags/hashtag_link"
import { usePosts } from "@/lib/hooks/use_posts"
import usePostViews from "@/lib/hooks/views/use_post_views"

const BASE_BACKEND_URL = "http://localhost:8091/posts"

/**
 * PostList Component
 * 
 * @component
 * @description
 * Displays a list of community posts with infinite scroll, post creation,
 * liking, commenting, and viewing functionality. Includes:
 * - Post creation form
 * - Infinite scroll loading
 * - Post deletion with confirmation
 * - View counting
 * - Like functionality
 * - Comment sections
 * - Markdown rendering with syntax highlighting
 * 
 * @state {Record<number, boolean>} expandedComments - Tracks expanded comment sections
 * @state {boolean} confirmOpen - Controls delete confirmation dialog visibility
 * @state {number|null} postToDelete - Stores post ID pending deletion
 */
export default function PostList() {
    const {
        posts,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        deletePost,
        isDeleting
    } = usePosts()
    const { token, user } = useAuth();
    const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({})
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [postToDelete, setPostToDelete] = useState<number | null>(null)

    // Infinite scroll handler
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

    /**
     * Toggles comment section visibility for a post
     * @param {number} postId - ID of the post to toggle comments for
     */
    const toggleComments = (postId: number) => {
        setExpandedComments(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }))
    }

    /**
     * Records a view for a post
     * @async
     * @param {string} postId - ID of the post being viewed
     */
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

    /**
     * Initiates post deletion flow
     * @param {number} postId - ID of the post to delete
     */
    const handleDeleteClick = (postId: number) => {
        setPostToDelete(postId)
        setConfirmOpen(true)
    }

    /**
     * Confirms and executes post deletion
     */
    const handleConfirmDelete = () => {
        if (postToDelete) {
            deletePost(postToDelete)
        }
        setConfirmOpen(false)
    }

    // Loading state
    if (isLoading && posts.length === 0) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    )

    // Error state
    if (error) return (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6" role="alert">
            <p className="font-bold">Error loading posts</p>
            <p>{error}</p>
        </div>
    )

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 relative">
            {/* Header with post creation */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    Community Posts
                </h1>
                <CreatePostForm />
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

            {/* Posts list */}
            <div className="space-y-6">
                {posts.map(post => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                        onViewportEnter={() => recordView(String(post.id))}
                    >
                        <div className="p-6">
                            {/* Post header with author and metadata */}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <Link href={`/home/users/${post.authorName}`}>
                                        <span className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                                            {post.authorName}
                                        </span>
                                    </Link>
                                    {post.title && (
                                        <h2 className="text-xl font-bold text-gray-800 mt-1">
                                            {post.title}
                                        </h2>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">
                                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                    </span>
                                    <ViewCounter postId={post.id} initialCount={post.viewsCount || 0} />
                                    {user?.userId === post.authorName && (
                                        <button
                                            onClick={() => handleDeleteClick(post.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                            disabled={isDeleting}
                                            aria-label="Delete post"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Post content with markdown rendering */}
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
                                        <HashtagLink
                                            key={index}
                                            tag={tag}
                                            className="px-2 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Post actions (like, comment) */}
                            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                <div className="flex items-center space-x-4">
                                    <LikeButton postId={post.id} />

                                    <button
                                        className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600 transition-colors"
                                        onClick={() => toggleComments(post.id)}
                                        aria-expanded={expandedComments[post.id]}
                                        aria-controls={`comments-${post.id}`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        <span className="text-sm">
                                            {expandedComments[post.id] ? 'Hide comments' : 'Comments'}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Comment section */}
                            {expandedComments[post.id] && (
                                <div className="mt-4 pt-4 border-t border-gray-100" id={`comments-${post.id}`}>
                                    <CommentSection postId={post.id} />
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Loading indicator for infinite scroll */}
            {isFetchingNextPage && (
                <div className="flex justify-center items-center my-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            )}

            {/* End of posts indicator */}
            {!hasNextPage && posts.length > 0 && (
                <div className="text-center text-gray-500 my-8 py-4 border-t border-gray-100">
                    You've reached the end of posts
                </div>
            )}

            {/* Empty state */}
            {!isLoading && posts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No posts found. Be the first to create one!
                </div>
            )}
        </div>
    )
}