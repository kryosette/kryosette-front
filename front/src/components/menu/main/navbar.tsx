'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Shield, Banknote, Network, ChevronDown, Menu, X, Gem } from 'lucide-react'

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

export function Navbar() {
    const [activeHover, setActiveHover] = useState<number | null>(null)
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
            <div className="container flex h-24 items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Логотип и навигация */}
                <div className="flex items-center w-full justify-between md:justify-center md:gap-16">
                    {/* Логотип */}
                    <Link href="/" className="flex items-center gap-3 group shrink-0">
                        <motion.div
                            className="p-2 rounded-lg bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-xs"
                            whileHover={{ rotate: 15, scale: 1.1 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                        >
                            <Gem className="h-6 w-6 text-gray-700" strokeWidth={1.5} />
                        </motion.div>
                        <span className="text-2xl font-light tracking-tight text-gray-800 hidden md:block">
                            KRYO<span className="font-medium">SETTE</span>
                        </span>
                    </Link>

                    {/* Центрированная навигация */}
                    <nav className="hidden md:flex items-center">
                        <div className="flex space-x-1">
                            {NAV_ITEMS.map((item, idx) => (
                                <motion.div
                                    key={item.name}
                                    onHoverStart={() => setActiveHover(idx)}
                                    onHoverEnd={() => setActiveHover(null)}
                                    className="relative px-1 py-1"
                                >
                                    <Button
                                        variant="ghost"
                                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 group px-4 py-3"
                                    >
                                        <span className="text-gray-400 group-hover:text-gray-600 transition-colors">
                                            {item.icon}
                                        </span>
                                        <span>{item.name}</span>
                                    </Button>

                                    {activeHover === idx && (
                                        <motion.div
                                            className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 w-56 origin-top"
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ type: 'spring', stiffness: 500 }}
                                        >
                                            <div className="rounded-xl bg-white border border-gray-100 shadow-lg p-2 space-y-1">
                                                {item.submenu.map((subItem) => (
                                                    <Link
                                                        key={subItem.title}
                                                        href={subItem.href}
                                                        className="flex w-full items-center px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all"
                                                    >
                                                        {subItem.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </nav>

                    {/* Кнопки авторизации */}
                    <div className="flex items-center gap-3">
                        <Link href={"/login"}>
                            <Button
                                variant="outline"
                                className="w-full border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-900"
                            >
                                Sign In
                            </Button>
                        </Link>
                        <Button className="hidden md:flex bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white shadow-sm">
                            Get Access
                        </Button>
                    </div>
                </div>

                {/* Кнопка мобильного меню */}
                <button
                    className="md:hidden p-2 rounded-lg hover:bg-gray-50 text-gray-500"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Мобильное меню */}
            {mobileOpen && (
                <motion.div
                    className="md:hidden bg-white border-t border-gray-100 shadow-inner"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: 'spring', damping: 25 }}
                >
                    <div className="container px-6 py-6 space-y-6">
                        <div className="flex flex-col space-y-4">
                            <Link href={"/login"}>
                                <Button
                                    variant="outline"
                                    className="w-full border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-900"
                                >
                                    Sign In
                                </Button>
                            </Link>
                            <Button className="w-full bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white shadow-sm">
                                Get Access
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {NAV_ITEMS.map((item, idx) => (
                                <div key={item.name} className="space-y-2">
                                    <button
                                        className="flex w-full items-center justify-between py-2 text-gray-600"
                                        onClick={() => setActiveHover(activeHover === idx ? null : idx)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-400">
                                                {item.icon}
                                            </span>
                                            <span>{item.name}</span>
                                        </div>
                                        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${activeHover === idx ? 'rotate-180' : ''}`} />
                                    </button>

                                    {activeHover === idx && (
                                        <div className="ml-11 space-y-2 pl-2 border-l border-gray-100">
                                            {item.submenu.map((subItem) => (
                                                <Link
                                                    key={subItem.title}
                                                    href={subItem.href}
                                                    className="block py-2 text-sm text-gray-500 hover:text-gray-900"
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
                </motion.div>
            )}
        </header>
    )
}