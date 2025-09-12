export interface PostDto {
    id: number;
    title: string;
    content: string;
    authorName: string;
    createdAt: string;
    likesCount: number;
    isLiked: boolean | null;
    viewsCount: number;
    comments: CommentDto[];
    hashtags: string[];
}

export interface CommentDto {
    id: number;
    content: string;
    authorName: string;
    createdAt: string;
}