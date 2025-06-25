'use client'

import { useEffect } from 'react';
import { useAuth } from '../../../lib/auth-provider';
import { useRouter } from 'next/navigation';

function ProtectedPage({ children }) {
    const router = useRouter();
    const { token, loading } = useAuth();

    useEffect(() => {
        if (!loading && !token) {
            router.push('/login');
        }
    }, [token, loading, router]);

    if (loading || !token) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            sdfs
        </div>
    );
}

export default ProtectedPage;