'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { LockKeyhole, Gem, Cpu, Shield, Eye, Code, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const features = [
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

export function MainMenu() {
    return (
        <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen pt-32 pb-20">
            {/* Анимированный фон */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gray-100"
                        initial={{
                            x: Math.random() * 100,
                            y: Math.random() * 100,
                            width: Math.random() * 8 + 2,
                            height: Math.random() * 8 + 2,
                            opacity: 0
                        }}
                        animate={{
                            x: [null, (Math.random() - 0.5) * 40],
                            y: [null, (Math.random() - 0.5) * 40],
                            opacity: [0, 0.2, 0]
                        }}
                        transition={{
                            duration: Math.random() * 15 + 10,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            delay: Math.random() * 5
                        }}
                    />
                ))}
            </div>

            <div className="relative container px-4 sm:px-6 lg:px-8 mx-auto">
                {/* Герой секция */}
                <div className="max-w-4xl mx-auto text-center mb-20 px-4">
                    <motion.span
                        className="inline-block px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium mb-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        EXCLUSIVE PRIVACY NETWORK
                    </motion.span>

                    <motion.h1
                        className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-gray-900 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Ultimate Digital
                        </span> <br />
                        <span className="font-medium">Discretion</span>
                    </motion.h1>

                    <motion.p
                        className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        For those who demand absolute privacy without compromise.
                        Your digital life remains exclusively yours.
                    </motion.p>
                </div>

                {/* Сетка фич */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20 px-4">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            whileHover={{ y: -5 }}
                            className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs hover:shadow-sm transition-all mx-auto w-full max-w-md"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-lg bg-gray-50 text-gray-700">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-medium text-gray-900">
                                    {feature.title}
                                </h3>
                            </div>
                            <p className="text-gray-600 mb-5">
                                {feature.description}
                            </p>
                            <Link
                                href={feature.href}
                                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 group"
                            >
                                Learn more
                                <svg
                                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* CTA секция */}
                <motion.div
                    className="bg-white border border-gray-100 rounded-2xl p-8 md:p-12 shadow-sm max-w-4xl mx-auto px-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.005 }}
                >
                    <div className="text-center">
                        <h2 className="text-2xl sm:text-3xl font-light text-gray-900 mb-4">
                            Ready for <span className="font-medium">absolute privacy</span>?
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                            Join the most exclusive network of individuals who value their digital sovereignty above all else.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white shadow mx-auto sm:mx-0"
                            >
                                Request Invitation
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900 mx-auto sm:mx-0"
                            >
                                Speak to Advisor
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}