'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
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
        <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
            <div className="container flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Логотип и навигация */}
                <div className="flex items-center w-full justify-between md:justify-center md:gap-16">
                    {/* Логотип */}
                    <Link href="/" className="flex items-center gap-3 group shrink-0">
                        <motion.div
                            className="p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-xs"
                            whileHover={{ rotate: 15, scale: 1.1 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                        >
                            <Gem className="h-6 w-6 text-gray-700" strokeWidth={1.5} />
                        </motion.div>
                        <motion.span
                            className="text-2xl font-light tracking-tight text-gray-800 hidden md:block"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            KRYO<span className="font-medium">SETTE</span>
                        </motion.span>
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

                                    <AnimatePresence>
                                        {activeHover === idx && (
                                            <motion.div
                                                className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 w-56 origin-top"
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -5 }}
                                                transition={{ type: 'spring', stiffness: 500 }}
                                            >
                                                <div className="rounded-xl bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-lg p-2 space-y-1">
                                                    {item.submenu.map((subItem) => (
                                                        <Link
                                                            key={subItem.title}
                                                            href={subItem.href}
                                                            className="flex w-full items-center px-4 py-3 text-sm text-gray-600 hover:bg-gray-50/50 hover:text-gray-900 rounded-lg transition-all"
                                                        >
                                                            {subItem.title}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </nav>

                    {/* Кнопки авторизации */}
                    <div className="flex items-center gap-3">
                        <Link href={"/login"}>
                            <motion.div whileHover={{ scale: 1.03 }}>
                                <Button
                                    variant="outline"
                                    className="border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-900"
                                >
                                    Sign In
                                </Button>
                            </motion.div>
                        </Link>
                        <motion.div whileHover={{ scale: 1.03 }}>
                            <Button className="hidden md:flex bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white shadow-sm">
                                Get Access
                            </Button>
                        </motion.div>
                    </div>
                </div>

                {/* Кнопка мобильного меню */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="md:hidden p-2 rounded-lg hover:bg-gray-50/50 text-gray-500"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.button>
            </div>

            {/* Мобильное меню */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200/50 shadow-inner"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ type: 'spring', damping: 25 }}
                    >
                        <div className="container px-6 py-6 space-y-6">
                            <div className="flex flex-col space-y-4">
                                <Link href={"/login"}>
                                    <motion.div whileHover={{ scale: 1.02 }}>
                                        <Button
                                            variant="outline"
                                            className="w-full border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-900"
                                        >
                                            Sign In
                                        </Button>
                                    </motion.div>
                                </Link>
                                <motion.div whileHover={{ scale: 1.02 }}>
                                    <Button className="w-full bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white shadow-sm">
                                        Get Access
                                    </Button>
                                </motion.div>
                            </div>

                            <div className="space-y-4">
                                {NAV_ITEMS.map((item, idx) => (
                                    <div key={item.name} className="space-y-2">
                                        <motion.button
                                            whileTap={{ scale: 0.98 }}
                                            className="flex w-full items-center justify-between py-2 text-gray-600"
                                            onClick={() => setActiveHover(activeHover === idx ? null : idx)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-400">
                                                    {item.icon}
                                                </span>
                                                <span>{item.name}</span>
                                            </div>
                                            <motion.div
                                                animate={{ rotate: activeHover === idx ? 180 : 0 }}
                                                transition={{ type: 'spring' }}
                                            >
                                                <ChevronDown className="h-4 w-4 text-gray-400" />
                                            </motion.div>
                                        </motion.button>

                                        <AnimatePresence>
                                            {activeHover === idx && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="ml-11 space-y-2 pl-2 border-l border-gray-200/50 overflow-hidden"
                                                >
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
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}