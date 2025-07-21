import { useState } from 'react';
import { PlusCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChats } from '@/lib/hooks/use_chats';

/**
 * ChatList Component
 * 
 * @component
 * @description
 * Displays a list of available chats and provides functionality to create new chats.
 * Includes a search input and creation button with real-time validation.
 * 
 * @example
 * <ChatList />
 * 
 * @hooks
 * - useChats: Manages chat state and creation logic
 * 
 * @state
 * - newChatName: string - Tracks the name of the new chat being created
 */
export function ChatList() {
    const [newChatName, setNewChatName] = useState('');
    const { chats, createChat, isCreating } = useChats();

    /**
     * Handles chat creation
     * 
     * @async
     * @function
     * @description
     * - Attempts to create a new chat with the current newChatName
     * - Resets the input field on success
     * - Logs errors to console on failure
     * 
     * @throws {Error} If chat creation fails
     */
    const handleCreateChat = async () => {
        try {
            await createChat(newChatName);
            setNewChatName('');
        } catch (error) {
            console.error('Failed to create chat:', error);
        }
    };

    return (
        <div className="w-64 border-r h-full p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Chats</h2>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCreateChat}
                    disabled={!newChatName.trim() || isCreating}
                    aria-label="Create new chat"
                    data-testid="create-chat-button"
                >
                    <PlusCircle className={`h-5 w-5 ${isCreating ? 'animate-pulse' : ''}`} />
                </Button>
            </div>

            <div className="relative mb-4">
                <Input
                    placeholder="New chat name"
                    value={newChatName}
                    onChange={(e) => setNewChatName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateChat()}
                    aria-label="New chat name input"
                    maxLength={50}
                />
                {newChatName && (
                    <span className="absolute right-2 top-2 text-xs text-muted-foreground">
                        {newChatName.length}/50
                    </span>
                )}
            </div>

            <div className="flex-1 overflow-y-auto" aria-label="Chats list">
                {chats?.length > 0 ? (
                    chats.map(chat => (
                        <a
                            key={chat.id}
                            href={`/chat/${chat.id}`}
                            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition-colors"
                            aria-label={`Chat: ${chat.name}`}
                        >
                            <MessageSquare className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{chat.name}</span>
                        </a>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        No chats available
                    </p>
                )}
            </div>
        </div>
    );
}