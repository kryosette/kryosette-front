import React from 'react';
import Link from 'next/link';

export function Sidebar() {
    return (
        <aside className="w-64 bg-gray-100 p-4">
            <nav>
                <ul>
                    <li>
                        <Link href="/(private)/home" className="block py-2 px-4 hover:bg-gray-200">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/(private)/home/profile" className="block py-2 px-4 hover:bg-gray-200">
                            Profile
                        </Link>
                    </li>
                    <li>
                        <Link href="/(private)/settings" className="block py-2 px-4 hover:bg-gray-200">
                            Settings
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}