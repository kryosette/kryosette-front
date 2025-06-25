'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { User } from 'lucide-react';

interface NavItem {
    label: string;
    href: string;
    megaMenu?: MegaMenuSection[];
}

interface MegaMenuSection {
    title: string;
    items: { label: string; href: string; description?: string }[];
    image?: string; // Path to an image, optional
}

const navItems: NavItem[] = [
    {
        label: 'Cards',
        href: '/cards',
        megaMenu: [
            {
                title: 'Debit cards',
                items: [
                    { label: 'Multicard', href: '/multicard', description: 'Cashback and discounts' },
                    { label: 'A card for young people', href: '/youth-card', description: 'Special conditions' },
                ],
            },
            {
                title: 'Кредитные карты',
                items: [
                    { label: 'Карта возможностей', href: '/credit-opportunity', description: 'Выгодные условия' },
                    { label: 'Карта привилегий', href: '/credit-premium', description: 'Для избранных' },
                ],
                image: '/credit-card-image.png', // Replace with your image path
            },
        ],
    },
    {
        label: 'Вклады',
        href: '/deposits',
        megaMenu: [
            {
                title: 'Выгодные вклады',
                items: [
                    { label: 'Вклад "Накопительный"', href: '/savings', description: 'Высокий процент' },
                    { label: 'Вклад "Инвестиционный"', href: '/investment', description: 'Увеличение капитала' },
                ],
            },
        ],
    },
    {
        label: 'Инвестиции',
        href: '/investments',
        megaMenu: [
            {
                title: 'Начните инвестировать',
                items: [
                    { label: 'Открыть брокерский счет', href: '/brokerage', description: 'Простой старт' },
                    { label: 'Инвестиционные продукты', href: '/products', description: 'Широкий выбор' },
                ],
            },
        ],
    },
    { label: 'Еще', href: '/more' }, // Basic "Еще" link
];

const Navbar = () => {
    const [openMegaMenu, setOpenMegaMenu] = useState<string | null>(null); // Track which mega menu is open

    const handleMegaMenuOpen = (label: string) => {
        setOpenMegaMenu(label);
    };

    const handleMegaMenuClose = () => {
        setOpenMegaMenu(null);
    };

    return (
        <nav className="bg-white shadow-sm py-2 sticky top-0 z-50">
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <span className="font-semibold text-2xl text-black tracking-tight">manuo</span>
                </Link>

                {/* Navigation Links with Mega Menus */}
                <ul className="hidden md:flex items-center space-x-6">
                    {navItems.map((item) => (
                        item.megaMenu ? (
                            <li key={item.label}>
                                <Popover open={openMegaMenu === item.label} onOpenChange={(isOpen) => isOpen ? handleMegaMenuOpen(item.label) : handleMegaMenuClose()}>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" size="sm" className="font-normal text-gray-600 hover:text-manuo-primary transition-colors duration-200"
                                            onMouseEnter={() => handleMegaMenuOpen(item.label)} // Open on hover (desktop)
                                            onMouseLeave={() => handleMegaMenuClose()} // Close on leave
                                        >
                                            {item.label}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[600px] p-4 grid grid-cols-2 gap-4 shadow-lg border rounded-md bg-white"
                                        onMouseEnter={() => handleMegaMenuOpen(item.label)} // Keep open on hover inside content
                                        onMouseLeave={() => handleMegaMenuClose()}
                                    >
                                        {item.megaMenu.map((section, index) => (
                                            <div key={index} className="space-y-2">
                                                <h3 className="font-semibold text-gray-700">{section.title}</h3>
                                                <ul>
                                                    {section.items.map((menuItem) => (
                                                        <li key={menuItem.label} className="py-1">
                                                            <Link href={menuItem.href} className="text-gray-600 hover:text-manuo-primary transition-colors duration-200 block">
                                                                {menuItem.label}
                                                                {menuItem.description && <p className="text-sm text-gray-500">{menuItem.description}</p>}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                                {section.image && index === item.megaMenu.length - 1 && ( // Display image in the last section
                                                    <Image
                                                        src={section.image}
                                                        alt={section.title}
                                                        width={200}
                                                        height={150}
                                                        className="rounded-md object-cover"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </PopoverContent>
                                </Popover>
                            </li>
                        ) : (
                            <li key={item.label}>
                                <Link href={item.href} className="text-gray-600 hover:text-manuo-primary transition-colors duration-200">{item.label}</Link>
                            </li>
                        )
                    ))}
                </ul>

                {/* Account Button */}
                <Button>
                    <Link href="/login" className="flex items-center space-x-2">
                        Personal account <User className='ml-2' />
                    </Link>
                </Button>

                {/* Mobile Menu (Placeholder) */}
                <div className="md:hidden">
                    <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;