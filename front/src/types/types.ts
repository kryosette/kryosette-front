export type User = {
    id: number;
    username: string;
    avatar?: string;
    online?: boolean;
};

export type Message = {
    id: number;
    content: string;
    sender: User;
    timestamp: string;
    status: 'DELIVERED' | 'READ';
};

export interface PollOption {
    id: number;
    text: string;
    voteCount: number;
    voted: boolean;
}

export interface Poll {
    id: number;
    question: string;
    options: PollOption[];
    multipleChoice: boolean;
    expiresAt: string | null;
    createdAt: string;
    voted: boolean;
    totalVotes: number;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    authorName: string;
    hashtags: string[];
    viewsCount: number;
    poll?: Poll;
}