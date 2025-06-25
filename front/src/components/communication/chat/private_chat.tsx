import { useRef, useEffect, useState } from 'react';

const PrivateChat = ({ chatId, friend }: { chatId: number; friend: User }) => {
    const [message, setMessage] = useState('');
    const { messages, sendMessage, isConnected } = usePrivateChat(chatId, currentUser.username);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSend = () => {
        if (message.trim()) {
            sendMessage(message);
            setMessage('');
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex flex-col h-full border rounded-lg">
            <div className="p-4 border-b bg-gray-50">
                <h3 className="font-semibold">Chat with {friend.username}</h3>
                <div className="text-sm text-gray-500">
                    {isConnected ? 'Online' : 'Offline'}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`mb-3 flex ${msg.sender === currentUser.id ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender === currentUser.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                            <div className="text-sm">{msg.content}</div>
                            <div className="text-xs opacity-70 mt-1">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..."
                        className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!isConnected}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrivateChat;