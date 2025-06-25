'use client'

import { usePosts } from "@/hooks/use_posts"
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

export default function PostList() {
    const {
        posts,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = usePosts()
    const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({})

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop !==
                document.documentElement.offsetHeight ||
                !hasNextPage ||
                isFetchingNextPage
            ) {
                return
            }
            fetchNextPage()
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

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    )

    if (error) return (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6" role="alert">
            <p className="font-bold">Error loading posts</p>
            <p>{error}</p>
        </div>
    )

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 relative">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Community Posts
                <div >
                    <CreatePostForm />
                </div>
            </h1>

            <div className="space-y-8">
                {posts.map(post => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                    >
                        <div className="p-6">
                            {/* Post Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <Link href={`/home/users/${post.authorName}`}>
                                        <span className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                                            @{post.authorName}
                                        </span>
                                    </Link>
                                    <h2 className="text-xl font-bold text-gray-800 mt-1">
                                        {post.title}
                                    </h2>
                                </div>
                                <span className="text-xs text-gray-400">
                                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                </span>
                            </div>

                            {/* Post Content */}
                            <div className="prose prose-sm max-w-none mb-6">
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

                            {/* Post Actions */}
                            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                <div className="flex items-center space-x-4">
                                    <LikeButton postId={post.id} />

                                    <button
                                        className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600 transition-colors"
                                        onClick={() => toggleComments(post.id)}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        <span className="text-sm">
                                            {expandedComments[post.id] ? 'Hide comments' : 'Comments'}
                                        </span>
                                    </button>
                                </div>

                                <button className="text-gray-400 hover:text-gray-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Comments Section */}
                            {expandedComments[post.id] && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <CommentSection postId={post.id} />
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>



            {isFetchingNextPage && (
                <div className="flex justify-center items-center my-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            )}

            {!hasNextPage && !isLoading && posts.length > 0 && (
                <div className="text-center text-gray-400 my-8 py-4 border-t border-gray-100">
                    You've reached the end of posts
                </div>
            )}
        </div>
    )
}