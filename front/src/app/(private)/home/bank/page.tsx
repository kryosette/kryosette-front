'use client';

import { useAuth } from '@/lib/auth-provider';
import React, { useState, useEffect } from 'react';

interface BankAccountDto {
    bankAccountId: number;
    user: { id: number };
    balance: number;
}

const AccountPage = () => {
    const [bankAccounts, setBankAccounts] = useState<BankAccountDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, logout, getUserIdFromToken } = useAuth();
    const userId = getUserIdFromToken();

    useEffect(() => {
        const fetchBankAccounts = async () => {
            try {
                if (!userId) {

                    setLoading(false);
                    return;
                }

                const response = await fetch(`http://localhost:8088/api/v1/bank_account/user/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setBankAccounts(data);
                setLoading(false);
            } catch (e) {
                setError(e.message);
                setLoading(false);
            }
        };

        if (token && userId) {
            fetchBankAccounts();
        } else {
            setLoading(false);
            if (!token) {
                error
            } else {
                error
            }
        }
    }, [token, userId]);

    if (loading) {
        return <div>Loading account information...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {bankAccounts.length === 0 ? (
                <p>No bank accounts found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bankAccounts.map((account) => (
                        <div key={account.bankAccountId} className="bg-white shadow-md rounded-md p-4">
                            <h2 className="text-sm font-semibold">Your account ID: {account.bankAccountId}</h2>
                            <p className='font-bold text-lg'>{account.balance !== null && account.balance !== undefined ? account.balance.toFixed(2) : '0.00'} ₽</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AccountPage;