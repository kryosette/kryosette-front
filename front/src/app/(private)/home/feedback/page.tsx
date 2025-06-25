'use client'

import React, { useState, useEffect } from 'react';
import UserMessageForm from './message-form';

function SupportMessageList() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch('http://localhost:8088/api/v1/messages/support/support'); // Запрос для поддержки (recipient = "support")

                if (response.ok) {
                    const data = await response.json();
                    setMessages(data);
                } else {
                    console.error('Failed to fetch messages:', response.status);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages(); // Загрузить сообщения при монтировании компонента
        const intervalId = setInterval(fetchMessages, 5000); // Опрашивать каждые 5 секунд

        return () => clearInterval(intervalId); // Очистить интервал при размонтировании
    }, []);

    return (

        <><h3>Support Messages</h3><ul>
            {messages.map((message) => (
                <li key={message?.id}>
                    {message?.content}
                </li>
            ))}
            <UserMessageForm />
        </ul></>

    );
}

export default SupportMessageList;