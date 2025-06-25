'use client'
import { useCreatePost } from '@/api/users/posts_queres'
import { useEffect, useState } from 'react'
import { Image, Smile, MapPin, Lock, X, Code } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/lib/auth-provider'
import { AnimatePresence, motion, useAnimation } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import 'highlight.js/styles/github-dark.css'

interface CreatePostFormProps {
    onPostCreated: () => void
    id: number
    firstname: string
    lastname: string
    email: string
}

const CreatePostForm = ({ onPostCreated }: CreatePostFormProps) => {
    const { token } = useAuth()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const [isPreview, setIsPreview] = useState(false)
    const controls = useAnimation()
    const textControls = useAnimation()

    const { createPost } = useCreatePost()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError('')

        try {
            await createPost(title, content)
            setTitle('')
            setContent('')
            setIsExpanded(false)
            onPostCreated()
        } catch (err) {
            setError('Failed to create post. Please try again.')
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        const sequence = async () => {
            while (true) {
                await textControls.start({
                    opacity: [0.8, 1, 0.8],
                    transition: { duration: 2, repeat: Infinity, repeatType: 'reverse' }
                })
            }
        }
        sequence()
    }, [textControls])

    const handleDragEnd = (event: any, info: any) => {
        controls.start({
            x: 0,
            y: 0,
            transition: { type: 'spring', stiffness: 500, damping: 30 }
        })
    }

    const insertCodeBlockJs = () => {
        const newText = `${content}\n\`\`\`js\n// Your code here\n\`\`\`\n`
        setContent(newText)
    }

    const insertCodeBlockJava = () => {
        const newText = `${content}\n\`\`\`java\n// Your code here\n\`\`\`\n`
        setContent(newText)
    }

    return (
        <motion.div
            drag
            dragConstraints={{
                top: -50,
                left: -50,
                right: 50,
                bottom: 50
            }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            animate={controls}
            initial={{ x: 0, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`fixed bottom-8 right-8 z-50 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 ${isExpanded ? 'w-96' : 'w-14 h-14'
                }`}
        >
            <AnimatePresence>
                {!isExpanded ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-2 cursor-pointer h-full flex items-center justify-center"
                        onClick={() => setIsExpanded(true)}
                        whileHover={{ rotate: 5 }}
                        whileTap={{ rotate: -5 }}
                    >
                        <motion.div animate={textControls}>
                            <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-gradient-to-r from-primary to-purple-500 text-white">
                                    Y
                                </AvatarFallback>
                            </Avatar>
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', bounce: 0.4 }}
                    >
                        <Card className="mx-auto transition-all border-0 shadow-none">
                            <form onSubmit={handleSubmit} className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <motion.div
                                        animate={textControls}
                                        className="flex items-center gap-3"
                                    >
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className="bg-gradient-to-r from-primary to-purple-500 text-white">
                                                Y
                                            </AvatarFallback>
                                        </Avatar>
                                        <motion.span
                                            animate={{
                                                color: ['#6366f1', '#8b5cf6', '#ec4899'],
                                                transition: { duration: 3, repeat: Infinity, repeatType: 'reverse' }
                                            }}
                                        >
                                            What's on your mind?
                                        </motion.span>
                                    </motion.div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        type="button"
                                        onClick={() => setIsExpanded(false)}
                                        className="h-8 w-8"
                                        whileHover={{ rotate: 90 }}
                                        whileTap={{ scale: 0.8 }}
                                        as={motion.button}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <Alert variant="destructive" className="mb-4">
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    </motion.div>
                                )}

                                <div className="mb-4">
                                    <motion.div whileHover={{ scale: 1.01 }}>
                                        <Input
                                            placeholder="Title (optional)"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="border-0 text-lg font-medium px-0 shadow-none focus-visible:ring-0 border-b rounded-none"
                                        />
                                    </motion.div>
                                </div>

                                <div className="mb-4">
                                    {isPreview ? (
                                        <div className="prose prose-sm max-w-none dark:prose-invert p-4 bg-gray-50 rounded-lg">
                                            <ReactMarkdown
                                                rehypePlugins={[rehypeHighlight]}
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    code({ node, inline, className, children, ...props }) {
                                                        const match = /language-(\w+)/.exec(className || '')
                                                        return !inline && match ? (
                                                            <div className="relative">
                                                                <div className="absolute right-2 top-1 text-xs text-gray-500">
                                                                    {match[1]}
                                                                </div>
                                                                <code
                                                                    className={className}
                                                                    style={{
                                                                        display: 'block',
                                                                        padding: '1rem',
                                                                        borderRadius: '0.5rem',
                                                                        overflowX: 'auto'
                                                                    }}
                                                                    {...props}
                                                                >
                                                                    {children}
                                                                </code>
                                                            </div>
                                                        ) : (
                                                            <code className={className} {...props}>
                                                                {children}
                                                            </code>
                                                        )
                                                    }
                                                }}
                                            >
                                                {content}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <motion.div whileHover={{ scale: 1.01 }}>
                                            <Textarea
                                                placeholder="Share your thoughts... Use ``` for code blocks"
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                required
                                                rows={8}
                                                className="border-0 p-0 shadow-none focus-visible:ring-0 min-h-[100px] font-mono text-sm"
                                            />
                                        </motion.div>
                                    )}
                                </div>

                                <motion.div
                                    className="flex items-center justify-between border-t pt-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            type="button"
                                            as={motion.button}
                                            whileHover={{ scale: 1.1, rotate: 10 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Image className="h-4 w-4 text-blue-500" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            type="button"
                                            as={motion.button}
                                            whileHover={{ scale: 1.1, rotate: -10 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Smile className="h-4 w-4 text-yellow-500" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            type="button"
                                            as={motion.button}
                                            whileHover={{ scale: 1.1, y: -5 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <MapPin className="h-4 w-4 text-red-500" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            type="button"
                                            as={motion.button}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => insertCodeBlockJs()}
                                        >
                                            <Code className="h-4 w-4 text-green-500" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            type="button"
                                            onClick={() => insertCodeBlockJava()}
                                        >
                                            <Code className="h-4 w-4 text-green-500" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            type="button"
                                            onClick={() => setIsPreview(!isPreview)}
                                            className="ml-2"
                                        >
                                            {isPreview ? 'Edit' : 'Preview'}
                                        </Button>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || !content.trim()}
                                        as={motion.button}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        animate={{
                                            backgroundColor: isSubmitting
                                                ? ['#6366f1', '#8b5cf6']
                                                : ['#8b5cf6', '#6366f1'],
                                            transition: { duration: 2, repeat: Infinity, repeatType: 'reverse' }
                                        }}
                                    >
                                        {isSubmitting ? (
                                            <motion.span
                                                className="flex items-center gap-2"
                                                animate={{ opacity: [0.6, 1, 0.6] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                            >
                                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Posting...
                                            </motion.span>
                                        ) : (
                                            <motion.span
                                                animate={{
                                                    textShadow: [
                                                        '0 0 8px rgba(255,255,255,0)',
                                                        '0 0 8px rgba(255,255,255,0.8)',
                                                        '0 0 8px rgba(255,255,255,0)'
                                                    ],
                                                    transition: { duration: 2, repeat: Infinity }
                                                }}
                                            >
                                                Post
                                            </motion.span>
                                        )}
                                    </Button>
                                </motion.div>
                            </form>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default CreatePostForm