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