'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth-provider';

interface UserDto {
    id: number;
    senderBankAccount: number;
    recipientBankAccount: number;
    amount: number;
}
const BACKEND_URL = "http://localhost:8088"
const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [user, setUser] = useState<UserDto | null>(null);
    const [loading, setLoading] = useState(true);
    const { token, logout } = useAuth();
    const accountId = 302

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${BACKEND_URL}/api/v1/transactions/user/${accountId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const UserDto = await response.json();
                    setUser(UserDto);
                } else {
                    console.error('Failed to fetch profile:', response.status);
                }
            } catch (error) {
                console.error('There was an error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchProfile();
        }
    }, [token]);

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (!user) {
        return <p>No user data available.</p>;
    }


    return (
        <div>
            <h3>Transaction History</h3>
            <table>
                <thead>
                    <tr>

                        <th>sdf{user.amount}</th>
                    </tr>
                </thead>
                <tbody>

                    <tr key={user?.id}>
                        <td>{user?.id}</td>
                        <td>{user?.amount}</td>
                        <td>{user?.transactionDate}</td>
                        <td>{user?.recipientBankAccount}</td>
                        <td>{user?.senderBankAccount}</td>
                    </tr>

                </tbody>
            </table>
        </div>
    );
};

export default TransactionHistory;