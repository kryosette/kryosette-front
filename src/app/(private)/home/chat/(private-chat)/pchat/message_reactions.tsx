'use client'

import { Button } from "@/components/ui/button";
import axios from "axios";
import { SmilePlus } from "lucide-react";
import { useEffect, useState } from "react";
import EmojiPicker, { EmojiClickData, EmojiStyle } from 'emoji-picker-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const BACKEND_URL_CHAT = "http://localhost:8092";

export const MessageReactions = ({
    messageId,
    roomId,
    token,
    onAddReaction,
    sender

}: {
    messageId: number;
    roomId: string;
    token: string;
    onAddReaction: (messageId: number, reaction: string) => void;
    sender: string;
}) => {
    const [reactions, setReactions] = useState<Record<string, number>>({});
    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => {
        const fetchReactions = async () => {
            try {
                const response = await axios.get(
                    `${BACKEND_URL_CHAT}/api/private-rooms/${roomId}/messages/${messageId}/reactions`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const rawReactions = response.data || {};
                const normalizedReactions: Record<string, number> = {};

                for (const [key, count] of Object.entries(rawReactions)) {
                    try {
                        const reactionObj = JSON.parse(key);
                        const emoji = reactionObj.reaction;
                        if (emoji && typeof count === 'number') {
                            normalizedReactions[emoji] = count;
                        }
                    } catch (e) {
                        console.warn('Failed to parse reaction:', key);
                    }
                }

                setReactions(normalizedReactions);
            } catch (error) {
                console.error("Error loading reactions:", error);
            }
        };

        fetchReactions();
    }, [messageId, roomId, token]);

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        onAddReaction(messageId, emojiData.emoji);
        setShowPicker(false);
    };

    return (
        <div className="flex gap-1 mt-1 relative">
            {Object.entries(reactions).map(([reaction, count]) => (
                <span
                    key={reaction}
                    className="h-8 px-2 py-0 text-xs"
                    onClick={() => onAddReaction(messageId, reaction)}
                >
                    <div className="inline-flex items-center bg-blue-200/20 rounded-full px-1.5 py-0.5 border">
                        <span className="emoji-text text-sm mr-1">{reaction}</span>
                        {count > 1 && <span className="text-xs mr-1">{count}</span>}
                        {/* <Avatar className="h-4 w-4 border border-background">
                            <AvatarFallback className="text-xs">
                                {sender}
                            </AvatarFallback>
                        </Avatar> */}
                    </div>
                </span>
            ))}

            <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setShowPicker(!showPicker)}
            >
                <SmilePlus className="h-4 w-4" />
            </Button>

            {showPicker && (
                <div className="absolute bottom-full right-0 z-50 shadow-lg rounded-md overflow-hidden"
                    style={{
                        maxHeight: 'calc(100vh - 100px)',
                        overflowY: 'auto',
                        transform: 'translateY(-10px)'
                    }}>
                    <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        width={300}
                        height={200}
                        searchDisabled
                        skinTonesDisabled
                        previewConfig={{ showPreview: false }}
                        lazyLoadEmojis
                        suggestedEmojisMode="recent"
                    />
                </div>
            )}
        </div>
    );
};