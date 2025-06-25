'use client'

import { useAuth } from '@/lib/auth-provider';
import React, { useState } from 'react';

function UserMessageForm({ userEmail }) {
    const [messageText, setMessageText] = useState('');
    const { token, logout } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const message = {
            sender: userEmail,
            recipient: recipientId;
            content: messageText,
        };

        try {
            const response = await fetch('http://localhost:8088/api/v1/messages/send', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });

            if (response.ok) {
                console.log('Message sent successfully!');
                setMessageText('');
            } else {
                console.error('Failed to send message:', response.status);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (

        <form onSubmit={handleSubmit}>
            <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Enter your message..."
            />
            <button type="submit">Send</button>
        </form>

    );
}

export default UserMessageForm;