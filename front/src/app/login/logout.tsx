'use client'; // This makes it a Client Component

import React from 'react';

const BACKEND_URL = "http://localhost:8088"


function LogoutButton() {
    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            const csrfToken = await getCSRFToken();

            const headers = {
                'Authorization': `Bearer ${token}`,
                ...(csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {})
            };

            const response = await fetch(`${BACKEND_URL}/api/v1/auth/logout`, {
                method: 'POST',
                headers: headers
            });

            if (response.ok) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                console.log('Logout successful!');
            } else {
                console.error('Logout failed:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    async function getCSRFToken() {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith('XSRF-TOKEN=')) {
                return cookie.substring('XSRF-TOKEN='.length);
            }
        }
        return null;
    }

    return (
        <button onClick={handleLogout}>Logout</button>
    );
}

export default LogoutButton;