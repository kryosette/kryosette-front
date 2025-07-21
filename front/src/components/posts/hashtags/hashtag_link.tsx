import Link from 'next/link';

interface HashtagLinkProps {
    tag: string;
    className?: string;
}

export const HashtagLink = ({ tag, className = '' }: HashtagLinkProps) => {
    const normalizedTag = tag.startsWith('#') ? tag.slice(1) : tag;

    return (
        <Link
            href={`/home/posts/hashtags/${normalizedTag}`}
            className={`text-blue-500 hover:text-blue-700 ${className}`}
        >
            #{normalizedTag}
        </Link>
    );
};