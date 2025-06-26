'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, useMotionTemplate, useMotionValue, animate } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    User,
    CreditCard,
    Landmark,
    LineChart,
    ChevronDown,
    Menu,
    X
} from 'lucide-react'

// Конфиг пунктов меню
const NAV_ITEMS = [
    {
        name: 'Cards',
        icon: <CreditCard className="h-4 w-4" />,
        submenu: [
            { title: 'Quantum Shield', href: '/cards/quantum' },
            { title: 'Stealth Black', href: '/cards/stealth' }
        ]
    },
    {
        name: 'Vault',
        icon: <Landmark className="h-4 w-4" />,
        submenu: [
            { title: 'Crypto Storage', href: '/vault/crypto' },
            { title: 'Data Bunkers', href: '/vault/bunkers' }
        ]
    },
    {
        name: 'Network',
        icon: <LineChart className="h-4 w-4" />,
        submenu: [
            { title: 'Node Map', href: '/network/map' },
            { title: 'Traffic Obfuscation', href: '/network/obfs' }
        ]
    }
]

export function Navbar() {
    const [activeHover, setActiveHover] = useState<number | null>(null)
    const [mobileOpen, setMobileOpen] = useState(false)

    // Анимационные значения для математических эффектов
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const radius = useMotionValue(0)
    const opacity = useMotionValue(0)

    const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
        const bounds = currentTarget.getBoundingClientRect()
        mouseX.set(clientX - bounds.left)
        mouseY.set(clientY - bounds.top)
        radius.set(Math.sqrt(bounds.width ** 2 + bounds.height ** 2) / 2.5)
        animate(opacity, 1, { duration: 0.5 })
    }

    return (
        <motion.header
            className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => animate(opacity, 0)}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', damping: 20 }}
        >
            {/* Градиентный эффект при движении мыши */}
            <motion.div
                className="pointer-events-none absolute inset-0 opacity-0"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              circle ${radius}px at ${mouseX}px ${mouseY}px,
              rgba(71, 127, 247, 0.15),
              transparent 80%
            )
          `,
                    opacity
                }}
            />

            <div className="container flex h-16 items-center justify-between px-6">
                {/* Лого с волновым эффектом */}
                <Link href="/" className="relative overflow-hidden group">
                    <motion.span
                        className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
                        whileHover={{
                            backgroundPosition: '100% 50%',
                            transition: { duration: 1.5, ease: [0.83, 0, 0.17, 1] }
                        }}
                        style={{
                            backgroundSize: '300% 100%',
                            backgroundImage: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)'
                        }}
                    >
                        kryosette
                    </motion.span>

                    <motion.div
                        className="absolute bottom-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-600"
                        initial={{ width: 0 }}
                        whileHover={{ width: '100%' }}
                        transition={{ duration: 0.6, ease: 'circOut' }}
                    />
                </Link>

                {/* Десктопное меню с 3D-трансформациями */}
                <nav className="hidden md:flex items-center space-x-1">
                    {NAV_ITEMS.map((item, idx) => (
                        <motion.div
                            key={item.name}
                            onHoverStart={() => setActiveHover(idx)}
                            onHoverEnd={() => setActiveHover(null)}
                            className="relative px-3 py-2"
                            whileHover={{
                                y: -2,
                                transition: { type: 'spring', stiffness: 500 }
                            }}
                        >
                            <Button variant="ghost" className="flex items-center gap-1 text-gray-300 group">
                                {item.icon}
                                <span>{item.name}</span>
                                <ChevronDown className={cn(
                                    "h-4 w-4 transition-transform",
                                    activeHover === idx ? "rotate-180" : ""
                                )} />
                            </Button>

                            {activeHover === idx && (
                                <motion.div
                                    className="absolute left-0 top-full mt-1 w-48 origin-top"
                                    initial={{ opacity: 0, y: -10, scaleY: 0.8 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        scaleY: 1,
                                        transition: {
                                            type: 'spring',
                                            damping: 25,
                                            stiffness: 300
                                        }
                                    }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <div className="rounded-lg border border-gray-800 bg-gray-900/95 backdrop-blur-lg p-1.5 shadow-xl">
                                        {item.submenu.map((subItem) => (
                                            <motion.div
                                                key={subItem.title}
                                                whileHover={{ x: 5 }}
                                                whileTap={{ scale: 0.97 }}
                                            >
                                                <Link
                                                    href={subItem.href}
                                                    className="flex w-full items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white rounded-md"
                                                >
                                                    {subItem.title}
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </nav>

                {/* Кнопка входа с эффектом "жидкого металла" */}
                <motion.div whileHover={{ scale: 1.03 }}>
                    <Link href="/login">
                        <Button className="relative overflow-hidden group">
                            <span className="relative z-10 flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Sign In
                            </span>
                            <motion.span
                                className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 opacity-0 group-hover:opacity-100"
                                initial={{ x: '-100%' }}
                                whileHover={{ x: '0%' }}
                                transition={{ duration: 0.6, ease: 'circOut' }}
                            />
                        </Button>
                    </Link>
                </motion.div>

                {/* Мобильное меню */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-gray-300"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </div>

            {/* Мобильное меню (анимированное) */}
            <motion.div
                className="md:hidden overflow-hidden"
                initial={false}
                animate={{
                    height: mobileOpen ? 'auto' : 0,
                    opacity: mobileOpen ? 1 : 0
                }}
                transition={{ type: 'spring', damping: 20 }}
            >
                <div className="px-6 py-4 space-y-4 border-t border-gray-800">
                    {NAV_ITEMS.map((item) => (
                        <div key={item.name} className="space-y-2">
                            <button className="flex w-full items-center justify-between py-2 text-gray-300">
                                <div className="flex items-center gap-2">
                                    {item.icon}
                                    <span>{item.name}</span>
                                </div>
                                <ChevronDown className="h-4 w-4" />
                            </button>

                            <div className="ml-8 space-y-1 border-l border-gray-800 pl-3">
                                {item.submenu.map((subItem) => (
                                    <Link
                                        key={subItem.title}
                                        href={subItem.href}
                                        className="block py-1.5 text-sm text-gray-400 hover:text-white"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {subItem.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.header>
    )
}