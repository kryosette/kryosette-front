'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Shield, Banknote, Network, ChevronDown, Menu, X, Gem, LockKeyhole, Cpu, Eye, Code, ArrowRight } from 'lucide-react'

const NAV_ITEMS = [
    {
        name: 'Security',
        icon: <Shield className="h-4 w-4" />,
        submenu: [
            { title: 'Quantum Encryption', href: '/security/quantum' },
            { title: 'Biometric Vaults', href: '/security/biometric' }
        ]
    },
    {
        name: 'Finance',
        icon: <Banknote className="h-4 w-4" />,
        submenu: [
            { title: 'Private Transactions', href: '/finance/private' },
            { title: 'Wealth Management', href: '/finance/wealth' }
        ]
    },
    {
        name: 'Network',
        icon: <Network className="h-4 w-4" />,
        submenu: [
            { title: 'Ghost Nodes', href: '/network/nodes' },
            { title: 'Zero-Trace Routing', href: '/network/routing' }
        ]
    }
]

const FEATURES = [
    {
        icon: <LockKeyhole className="h-5 w-5" strokeWidth={1.5} />,
        title: "Quantum Encryption",
        description: "Unbreakable security protocols using quantum-resistant algorithms",
        href: "/quantum"
    },
    {
        icon: <Gem className="h-5 w-5" strokeWidth={1.5} />,
        title: "Private Wealth",
        description: "Discreet asset management with zero footprint",
        href: "/wealth"
    },
    {
        icon: <Cpu className="h-5 w-5" strokeWidth={1.5} />,
        title: "Neural Privacy",
        description: "AI-powered behavior obfuscation technology",
        href: "/neural"
    },
    {
        icon: <Shield className="h-5 w-5" strokeWidth={1.5} />,
        title: "Zero-Knowledge",
        description: "Verify without revealing any information",
        href: "/zero-knowledge"
    },
    {
        icon: <Eye className="h-5 w-5" strokeWidth={1.5} />,
        title: "Ghost Mode",
        description: "Complete digital invisibility when needed",
        href: "/ghost"
    },
    {
        icon: <Code className="h-5 w-5" strokeWidth={1.5} />,
        title: "Secure API",
        description: "Military-grade integration for your systems",
        href: "/api"
    }
]

export function Navbar() {
    const [activeHover, setActiveHover] = useState<number | null>(null)
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
            <div className="container flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Логотип */}
                <Link href="/" className="flex items-center gap-2 shrink-0">
                    <div className="p-1.5 rounded-lg bg-white/50 backdrop-blur-sm">

                    </div>
                    <span className="text-lg font-black text-black lowercase">
                        kryosette
                    </span>
                </Link>

                {/* Центрированная навигация */}
                <nav className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
                    <div className="flex space-x-0">
                        {NAV_ITEMS.map((item, idx) => (
                            <div
                                key={item.name}
                                onMouseEnter={() => setActiveHover(idx)}
                                onMouseLeave={() => setActiveHover(null)}
                                className="relative"
                            >
                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-1.5 text-gray-600 hover:text-black hover:bg-white/50 px-3 py-1.5 text-sm"
                                >
                                    <span>{item.icon}</span>
                                    <span>{item.name}</span>
                                </Button>

                                {activeHover === idx && (
                                    <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 w-48">
                                        <div className="rounded-lg bg-white/90 backdrop-blur-md border border-gray-200/50 shadow-lg p-1 space-y-0.5">
                                            {item.submenu.map((subItem) => (
                                                <Link
                                                    key={subItem.title}
                                                    href={subItem.href}
                                                    className="flex w-full items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50/50 hover:text-black rounded-md transition-colors"
                                                >
                                                    {subItem.title}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </nav>

                {/* Кнопки авторизации - сдвинуты вправо */}
                <div className="flex items-center gap-2 ml-auto">
                    <Link href={"/login"}>
                        <Button
                            variant="ghost"
                            className="text-gray-600 hover:text-black hover:bg-white/50 text-sm px-3 py-1.5"
                        >
                            Sign In
                        </Button>
                    </Link>
                    <Button className="bg-black text-white hover:bg-gray-800 text-sm px-3 py-1.5">
                        Get Access
                    </Button>
                </div>

                {/* Кнопка мобильного меню */}
                <button
                    className="md:hidden p-1.5 rounded-lg hover:bg-white/50 text-gray-600 ml-2"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </button>
            </div>

            {/* Мобильное меню */}
            {mobileOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50">
                    <div className="container px-4 py-4 space-y-4">
                        <div className="flex flex-col space-y-2">
                            <Link href={"/login"}>
                                <Button
                                    variant="ghost"
                                    className="w-full text-gray-600 hover:text-black hover:bg-gray-50/50 justify-start"
                                >
                                    Sign In
                                </Button>
                            </Link>
                            <Button className="w-full bg-black text-white hover:bg-gray-800 justify-start">
                                Get Access
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {NAV_ITEMS.map((item, idx) => (
                                <div key={item.name} className="space-y-1">
                                    <button
                                        className="flex w-full items-center justify-between py-1.5 text-gray-600 text-sm"
                                        onClick={() => setActiveHover(activeHover === idx ? null : idx)}
                                    >
                                        <div className="flex items-center gap-2">
                                            {item.icon}
                                            <span>{item.name}</span>
                                        </div>
                                        <ChevronDown className="h-3 w-3 text-gray-400" />
                                    </button>

                                    {activeHover === idx && (
                                        <div className="ml-6 space-y-1 pl-2 border-l border-gray-200/50">
                                            {item.submenu.map((subItem) => (
                                                <Link
                                                    key={subItem.title}
                                                    href={subItem.href}
                                                    className="block py-1.5 text-sm text-gray-500 hover:text-black"
                                                    onClick={() => setMobileOpen(false)}
                                                >
                                                    {subItem.title}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
