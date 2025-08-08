'use client'

import { useEffect, useState } from 'react'
import { Image, Smile, X, Hash } from 'lucide-react'
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
import { useCreatePost } from '@/lib/api/users/posts_queres'
import { Switch } from '@/components/ui/switch'

interface PollState {
    question: string
    options: string[]
    multipleChoice: boolean
    expiresInDays: number
    isActive: boolean
}

interface PostData {
    title: string
    content: string
    hashtags: string[]
    poll?: {
        question: string
        options: string[]
        multipleChoice: boolean
        expiresAt: string
    }
    expiresAt?: string | null
}



/**
 * Interface for CreatePostForm props
 * @interface CreatePostFormProps
 * @property {() => void} onPostCreated - Callback when post is successfully created
 * @property {number} id - User ID
 * @property {string} firstname - User's first name
 * @property {string} lastname - User's last name
 * @property {string} email - User's email
 */
interface CreatePostFormProps {
    onPostCreated: () => void
    id: number
    firstname: string
    lastname: string
    email: string
}

/**
 * CreatePostForm Component
 * 
 * @component
 * @description
 * A draggable, expandable form for creating posts with markdown support,
 * hashtags, and rich media options. Features preview mode and animations.
 * 
 * @param {CreatePostFormProps} props - Component props
 * 
 * @state {string} title - Post title
 * @state {string} content - Post content
 * @state {string[]} hashtags - Array of hashtags
 * @state {string} currentHashtag - Current hashtag input
 * @state {string} error - Error message
 * @state {boolean} isSubmitting - Loading state during submission
 * @state {boolean} isExpanded - Form expansion state
 * @state {boolean} isPreview - Markdown preview toggle
 */
const CreatePostForm = ({ onPostCreated }: CreatePostFormProps) => {
    const { token } = useAuth()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [hashtags, setHashtags] = useState<string[]>([])
    const [enableExpiration, setEnableExpiration] = useState(false)
    const [expiresAt, setExpiresAt] = useState<Date | null>(null)
    const [currentHashtag, setCurrentHashtag] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const [isPreview, setIsPreview] = useState(false)
    const controls = useAnimation()
    const textControls = useAnimation()
    const [dateError, setDateError] = useState('');
    const [poll, setPoll] = useState<PollState>({
        question: '',
        options: ['', ''],
        multipleChoice: false,
        expiresInDays: 1,
        isActive: false
    })

    const formatForServer = (date) => {
        return new Date(date).toISOString().slice(0, 16); // "2025-08-06T14:03"
    };

    function formatDateTimeLocal(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }


    const { createPost } = useCreatePost()

    /**
     * Handles form submission
     * @async
     * @param {React.FormEvent} e - Form event
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError('')

        try {
            const postData: PostData = {
                title,
                content,
                hashtags,
                ...(enableExpiration && expiresAt && {
                    expiresAt: expiresAt.toISOString()
                }),
                poll: poll.isActive ? {
                    question: poll.question,
                    options: poll.options.filter(opt => opt.trim() !== ''),
                    multipleChoice: poll.multipleChoice,
                    expiresAt: new Date(Date.now() + poll.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
                } : undefined
            }

            await createPost(postData)
            setTitle('')
            setContent('')
            setHashtags([])
            setPoll({
                question: '',
                options: ['', ''],
                multipleChoice: false,
                expiresInDays: 1,
                isActive: false
            })
            setIsExpanded(false)
            onPostCreated()
        } catch (err) {
            setError('Failed to create post. Please try again.')
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Animation sequence for avatar pulse effect
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

    /**
     * Handles drag end animation
     * @param {any} event - Drag event
     * @param {any} info - Motion event info
     */
    const handleDragEnd = (event: any, info: any) => {
        controls.start({
            x: 0,
            y: 0,
            transition: { type: 'spring', stiffness: 500, damping: 30 }
        })
    }

    /**
     * Inserts JavaScript code block template
     */
    const insertCodeBlockJs = () => {
        const newText = `${content}\n\`\`\`js\n// Your code here\n\`\`\`\n`
        setContent(newText)
    }

    /**
     * Inserts Java code block template
     */
    const insertCodeBlockJava = () => {
        const newText = `${content}\n\`\`\`java\n// Your code here\n\`\`\`\n`
        setContent(newText)
    }

    /**
     * Adds a hashtag to the list
     */
    const addHashtag = () => {
        if (currentHashtag.trim()) {
            const normalizedTag = currentHashtag.startsWith('#')
                ? currentHashtag
                : `#${currentHashtag}`

            if (!hashtags.includes(normalizedTag)) {
                setHashtags([...hashtags, normalizedTag])
                setCurrentHashtag('')
            }
        }
    }

    /**
     * Removes a hashtag from the list
     * @param {string} tagToRemove - Hashtag to remove
     */
    const removeHashtag = (tagToRemove: string) => {
        setHashtags(hashtags.filter(tag => tag !== tagToRemove))
    }

    /**
     * Handles key events for hashtag input
     * @param {React.KeyboardEvent} e - Keyboard event
     */
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            addHashtag()
        }
    }

    const togglePoll = () => {
        setPoll(prev => ({
            ...prev,
            isActive: !prev.isActive,
            question: !prev.isActive ? '' : prev.question,
            options: !prev.isActive ? ['', ''] : prev.options
        }))
    }

    const addPollOption = () => {
        if (poll.options.length < 10) {
            setPoll(prev => ({
                ...prev,
                options: [...prev.options, '']
            }))
        }
    }

    const removePollOption = (index: number) => {
        if (poll.options.length > 2) {
            setPoll(prev => ({
                ...prev,
                options: prev.options.filter((_, i) => i !== index)
            }))
        }
    }

    const updatePollOption = (index: number, value: string) => {
        setPoll(prev => ({
            ...prev,
            options: prev.options.map((opt, i) => (i === index ? value : opt))
        }))
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
            className={`fixed bottom-8 right-8 z-50 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 ${isExpanded ? 'w-96 max-h-[90vh]' : 'w-14 h-14'}`}
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
                        className="h-full"
                    >
                        <Card className="mx-auto transition-all border-0 shadow-none h-full flex flex-col">
                            <form onSubmit={handleSubmit} className="p-4 flex flex-col flex-1 overflow-hidden">
                                <div className="flex-1 overflow-y-auto">
                                    {/* Form header with avatar and close button */}
                                    <div className="flex items-center justify-between mb-4">
                                        <motion.div animate={textControls} className="flex items-center gap-3">
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

                                    {/* Error message display */}
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

                                    {/* Title input */}
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

                                    <div className="flex flex-col gap-2 mb-4">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="enable-expiration"
                                                checked={enableExpiration}
                                                onCheckedChange={(checked) => {
                                                    setEnableExpiration(checked);
                                                    if (!checked) {
                                                        setExpiresAt(null);
                                                        setDateError('');
                                                    }
                                                }}
                                            />
                                            <label htmlFor="enable-expiration" className="text-sm">
                                                Set expiration date
                                            </label>
                                        </div>

                                        {enableExpiration && (
                                            <div className="flex flex-col">
                                                <Input
                                                    type="datetime-local"
                                                    value={expiresAt ? formatDateTimeLocal(expiresAt) : ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (!value) {
                                                            setExpiresAt(null);
                                                            setDateError('');
                                                            return;
                                                        }

                                                        const selectedDate = new Date(value);
                                                        const now = new Date();

                                                        if (selectedDate < now) {
                                                            setDateError('Please select a future date and time');
                                                        } else {
                                                            setDateError('');
                                                        }
                                                        setExpiresAt(selectedDate);
                                                    }}
                                                    min={formatDateTimeLocal(new Date())}
                                                    className="w-full"
                                                />
                                                {dateError && (
                                                    <p className="text-sm text-red-500 mt-1">{dateError}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content area with preview toggle */}
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
                                                    rows={5}
                                                    className="border-0 p-0 shadow-none focus-visible:ring-0 min-h-[100px] font-mono text-sm"
                                                />
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Poll form */}
                                    {poll.isActive && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                                        >
                                            <div className="mb-4">
                                                <Input
                                                    placeholder="Poll question"
                                                    value={poll.question}
                                                    onChange={(e) => setPoll(prev => ({ ...prev, question: e.target.value }))}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2 mb-4">
                                                {poll.options.map((option, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <Input
                                                            placeholder={`Option ${index + 1}`}
                                                            value={option}
                                                            onChange={(e) => updatePollOption(index, e.target.value)}
                                                            required
                                                        />
                                                        {poll.options.length > 2 && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => removePollOption(index)}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 mb-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={addPollOption}
                                                    disabled={poll.options.length >= 10}
                                                >
                                                    Add Option
                                                </Button>

                                                <div className="flex items-center space-x-2">
                                                    <Switch
                                                        id="multiple-choice"
                                                        checked={poll.multipleChoice}
                                                        onCheckedChange={(checked) =>
                                                            setPoll(prev => ({ ...prev, multipleChoice: checked }))
                                                        }
                                                    />
                                                    <label htmlFor="multiple-choice" className="text-sm">
                                                        Multiple choice
                                                    </label>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm">Expires in:</span>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        max="30"
                                                        value={poll.expiresInDays}
                                                        onChange={(e) =>
                                                            setPoll(prev => ({
                                                                ...prev,
                                                                expiresInDays: Math.max(1, Math.min(30, Number(e.target.value)))
                                                            }))
                                                        }
                                                        className="w-16"
                                                    />
                                                    <span className="text-sm">days</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Hashtags display */}
                                    <div className="mb-4">
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {hashtags.map((tag, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    exit={{ scale: 0.8, opacity: 0 }}
                                                    className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                                                >
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeHashtag(tag)}
                                                        className="ml-1 text-indigo-500 hover:text-indigo-700"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Add hashtags"
                                                value={currentHashtag}
                                                onChange={(e) => setCurrentHashtag(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                className="flex-1"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={addHashtag}
                                                as={motion.button}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Hash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Form footer with action buttons */}
                                <motion.div
                                    className="flex items-center justify-between border-t pt-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant={poll.isActive ? "default" : "outline"}
                                            size="sm"
                                            onClick={togglePoll}
                                        >
                                            {poll.isActive ? 'Remove Poll' : 'Add Poll'}
                                        </Button>
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