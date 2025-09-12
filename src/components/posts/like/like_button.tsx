import { useLike } from '@/lib/hooks/use_likes'
import { Heart } from 'lucide-react'

export const LikeButton = ({ postId }: { postId: number }) => {
    const { isLiked, likeCount, isLoading, toggleLike } = useLike(postId)

    return (
        <div className="flex items-center gap-1">
            <button
                onClick={() => toggleLike()}
                disabled={isLoading}
                className={`p-2 rounded-full transition-colors ${isLiked
                    ? 'text-red-500 hover:bg-red-50'
                    : 'text-gray-500 hover:bg-gray-100'
                    }`}
            >
                <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
            <span className="text-sm text-gray-600">{likeCount}</span>
        </div>
    )
}