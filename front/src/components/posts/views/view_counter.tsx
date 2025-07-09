'use client'

import { useEffect, useState } from 'react';
import { EyeIcon } from 'lucide-react';

interface ViewCounterProps {
    initialCount: number;
}

export const ViewCounter = ({ initialCount }: ViewCounterProps) => {
    const [views, setViews] = useState(initialCount);

    useEffect(() => {
        setViews(initialCount);
    }, [initialCount]);

    return (
        <div className="flex items-center space-x-1 text-gray-500">
            <EyeIcon className="w-5 h-5" />
            <span className="text-sm">{views}</span>
        </div>
    );
};